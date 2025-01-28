import * as functions from "firebase-functions/v1";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { Storage } from "@google-cloud/storage";
import { onCall } from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();

const storage = new Storage();

const rawVideoBucketName = "major-will-raw-videos";

const videoCollectionId = "videos";

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: "processing" | "processed",
    title?: string,
    description?: string
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
        const data = request.data;
        const bucket = storage.bucket(rawVideoBucketName);

        // Generate a unique filename for upload
        const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

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
        await firestore.collection(videoCollectionId).limit(10).get();
    return querySnapshot.docs.map((doc) => doc.data());
});
