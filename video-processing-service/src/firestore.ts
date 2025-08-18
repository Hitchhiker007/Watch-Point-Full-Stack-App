import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { Firestore } from "firebase-admin/firestore";

initializeApp({ credential: credential.applicationDefault() });

const firestore = new Firestore();

// Note: This requires setting an env variable in Cloud Run
// if (process.env.NODE_ENV !== 'production') {
//   firestore.settings({
//       host: "localhost:8080", // Default port for Firestore emulator
//       ssl: false
//   });
// } 


const videoCollectionId = 'videos';

export interface Video {
    id?: string,
    uid?: string,
    filename?: string,
    status?: 'processing' | 'processed',
    title?: string,
    description?: string,
    genre?: string,
    thumbnails?: string[],
}

// call await as we need the data from thr snapshot to come first before reutring the data of the video

export async function getVideo(videoId: string) {
    const snapshot = await firestore.collection(videoCollectionId).doc(videoId).get();
    // return an empty obejct instead of undefined
    return (snapshot.data() as Video) ?? {};
}


export function setVideo(videoId: string, video: Video) {
    return firestore
        .collection(videoCollectionId)
        .doc(videoId)
        // second parameter are options, if a video already exists in the collection the new information is merged
        // instead of overwritting, so any missing information isnt instead just deleted when added
        .set(video, { merge: true })
}

// determine if a video is new or not but comapring its status
export async function isVideoNew(videoId: string) {
    const video = await getVideo(videoId);
    return video?.status === undefined;
}
