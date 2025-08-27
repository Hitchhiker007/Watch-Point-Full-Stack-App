import * as functions from "firebase-functions/v1";
import { initializeApp } from "firebase-admin/app";
import { Firestore, FieldValue } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { Storage } from "@google-cloud/storage";
import { onCall } from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();

const storage = new Storage();

const rawVideoBucketName = "major-will-raw-videos";

const videoCollectionId = "videos";
// const userCollectionId = "users";

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string
}

export interface VideoMetadata {
  title: string;
  description: string;
  genre: string;
}

/**
 * Creates or updates a video document in Firestore.
 * If the document already exists, the provided
 * data is merged with the existing data.
 *
 * @param {string} videoId - The unique ID of the video
 * (usually UID + timestamp)
 * @param {Object} videoData -
 * The video metadata to store, including UID, status,
 * and optional fields like title, description, genre
 * @return {Promise<void>} A Promise that resolves when the
 * Firestore write is complete
 */
async function setVideo(
  videoId: string,
  videoData: Partial<VideoMetadata> & { uid: string; status: string }
) {
  await firestore.collection("videos")
  .doc(videoId).set(videoData, { merge: true });
}

export const createUser = functions.auth.user().onCreate((user) => {
    const userInfo = {
        uid: user.uid,
        email: user.email,
        photoUrl: user.photoURL,
    };

    firestore.collection("users").doc(user.uid).set(userInfo);
    logger.info(`User Created: ${JSON.stringify(userInfo)}`);
    return;
});

export const generateUploadUrl =
    onCall({ maxInstances: 1 }, async (request) => {
        // Check if the user is authentication
        if (!request.auth) {
            throw new functions.https.HttpsError(
                "failed-precondition",
                "The function must be called while authenticated."
            );
        }

        const auth = request.auth;
        const data = request.data as {
      fileExtension: string;
      title: string;
      description: string;
      genre: string;
    };
        const bucket = storage.bucket(rawVideoBucketName);

        // Generate a unique filename for upload
        const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

         // Save metadata to Firestore
    await setVideo(fileName, {
      uid: auth.uid,
      status: "processing",
      title: data.title,
      description: data.description,
      genre: data.genre,
    });

        // Get a v4 signed URL for uploading file
        const [url] = await bucket.file(fileName).getSignedUrl({
            version: "v4",
            action: "write",
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        });

        return { url, fileName };
    });

// doesnt need request, its a naive solution,
// where we're just going to fetch 10 videos from the database
// and render them in the ui

// no pagenation
// Sorting: Videos are often sorted by various criteria such as:

// Date created (newest first).
// Views or likes (most popular first).
// Relevance (based on search terms, tags, etc.).
// Currently no filter on the videos for certain criteria
// (e.g., category, duration, tags, or user preferences).

// No Metadatae as Video databases typically contain metadata such as
// video title, description, length, views, and so on.  for Pagination to
// work we need to return these fields along with the video URL or video ID.

// curently not tailored to the users preferences or subscriptions

export const getVideos = onCall({ maxInstances: 1 }, async () => {
    const querySnapshot =
        // get a limit of 10 videos
        await firestore.collection(videoCollectionId)
        .where("status", "==", "processed")
        .limit(100)
        .get();
        // await firestore.collection(userCollectionId).limit(10).get;
    return querySnapshot.docs.map((doc) => doc.data());
});

export const getUserPhotoUrl = onCall({ maxInstances: 1 }, async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "The function must be called while authenticated."
        );
    }

    const auth = request.auth;
    const userRef = firestore.collection("users").doc(auth.uid);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new functions.https.HttpsError(
            "not-found",
            "User not found in Firestore."
        );
    }

    // Return the photoURL
    return { photoURL: userDoc.data()?.photoUrl || "" };
});

export const getUserEmail = onCall({ maxInstances: 1}, async (request) =>{
    if (!request.auth) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "User must be signed in or authenicated."
        );
    }
    const auth = request.auth;
    const userRef = firestore.collection("users").doc(auth.uid);

    const userDoc = await userRef.get();
    if (!userDoc.exists) {
        throw new functions.https.HttpsError(
            "not-found",
            "User not found in Firestore."
        );
    }

    return { email: userDoc.data()?.email || ""};
});

export const getUploaderInfo = onCall({ maxInstances: 1 }, async (request) => {
  const { uid } = request.data as { uid: string };

  if (!uid) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with a UID."
    );
  }

  const userRef = firestore.collection("users").doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new functions.https.HttpsError(
      "not-found",
      `Uploader with UID ${uid} not found.`
    );
  }

  const data = userDoc.data();

  return {
    email: data?.email || "",
    photoURL: data?.photoUrl || "",
  };
});

// ADD Comments to a video --------------------------------------->
export const addComment = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.
    HttpsError("failed-precondition", "You must be signed in to comment.");
  }

  const { videoId, text} = request.data as {videoId: string; text: string};

  if ( !videoId || !text || text.trim() === "" ) {
    throw new
    functions.https.HttpsError("invalid-argument", "videoId, text, required");
  }

  // Fetch the user's photoURL from the users collection
  const userRef = firestore.collection("users").doc(request.auth.uid);
  const userDoc = await userRef.get();
  const photoURL = userDoc.exists ? userDoc.data()?.photoURL || "" : "";

  // create a subcollection "comments" under the video
  const commentsRef = firestore.collection("videos")
  .doc(videoId).collection("comments");
  const docRef = await commentsRef.add({
    uid: request.auth.uid,
    text: text.trim(),
    photoURL, // store the photoURL along with the comment
    email: request.auth.token.email || "", // store email
    createdAt: FieldValue.serverTimestamp(), // set server timestamp
  });

  // return relevant fields so the frontend has them
  return {
    id: docRef.id,
    uid: request.auth.uid,
    text: text.trim(),
    photoURL,
    email: request.auth.token.email || "",
  };
});

// GET Comments for a video ----------------------------------------->
export const getComments = onCall(async (request) => {
  const { videoId } = request.data as { videoId: string };

  if (!videoId) {
    throw new
    functions.https.HttpsError("invalid-argument", "videoId is required.");
  }

  const commentsRef =
  firestore.collection("videos").doc(videoId).collection("comments");
  const snapshot =
  await commentsRef.orderBy("createdAt", "desc").limit(50).get();

  const comments = snapshot.docs.map((doc) => {
  const docData = doc.data();
  return {
    id: doc.id,
    uid: docData.uid,
    text: docData.text,
    photoURL: docData.photoURL || "",
    email: docData.email || "",
     // convert Firestore Timestamp to number
    createdAt: docData.createdAt ? docData.createdAt.toMillis() : undefined,
  };
});

  return comments;
});

export const getUserVideos = onCall({ maxInstances: 1}, async (request) => {
  const { uid } = request.auth ?? {}; // first pull the authenticated users uid
  if (!uid) {
    throw new Error("Not authenticated");
  }

  const querySnapshot = await firestore
    .collection("videos")
    .where("uid", "==", uid)
    .where("status", "==", "processed")
    .limit(50)
    .get();

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
});


