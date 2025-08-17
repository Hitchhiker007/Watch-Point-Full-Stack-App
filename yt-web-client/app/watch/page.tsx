'use client';

import styles from "./watch.module.css";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from 'react';
import { functions } from "../firebase/firebase"; // your initialized functions
import { httpsCallable } from "firebase/functions";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase/firebase"; // your initialized Firebase app
import VideoUploader from "./uploader";

export interface Video {
  id?: string;               
  uid?: string;              
  filename: string;          
  status: "processing" | "processed"; 
  title?: string;            
  description?: string;    
  genre?: string;  
}


const VideoPlayer = () => {

    const videoPrefix = 'https://storage.googleapis.com/major-will-processed-videos/';

    // Call useSearchParams directly at the top of your component
    const searchParams = useSearchParams();
    const videoParam = searchParams.get('v'); // Get the 'v' query parameter

    // Set up state to store video source once it's available
    const [videoSource, setVideoSource] = useState<string | null>(null);
    const [videoTitle, setVideoTitle] = useState('');
    const [videoDescription, setVideoDescription] = useState('');
    const [videoGenre, setVideoGenre] = useState('');
    const [userId, setUserId] = useState('');
     
  useEffect(() => {
    if (!videoParam) return;

    console.log(videoParam)
    const cleanFilename = videoParam.replace(/^processed-/, '');
    console.log(cleanFilename); 
    const processedCleanFilename = videoParam.replace(/^processed-/, '').replace(/\.mp4$/, '');
    console.log(processedCleanFilename)

    // Video comes from the processed file
    setVideoSource(videoParam);


    const firestore = getFirestore(app);
    const videoDocRef = doc(firestore, "videos", cleanFilename);
    getDoc(videoDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data() as Video;
            setVideoTitle(data.title || "");
            setVideoDescription(data.description || "");
            setVideoGenre(data.genre || "")
        }
    });
    const videoProcessedDocRef = doc(firestore, "videos", processedCleanFilename );
    getDoc(videoProcessedDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data() as Video;
            setUserId(data.uid || "");
        }
    });
}, [videoParam]);


    if (!videoSource) {
        return <div>Loading video...</div>;
    }
  

    return (
        <div className={styles.videoPlayer}>
            <h1>{videoTitle}</h1>
            <video controls width="640" height="360">
                <source src={videoPrefix + videoSource} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <p>Description</p>
            <p>{videoDescription}</p>
            <p>Genre: {videoGenre}</p>
            <VideoUploader uploaderUid={userId} />
        </div>
    );
};

export default function Watch() {
    return (
        <div className={styles.container}>
            <Suspense fallback={<div>Loading video...</div>}>
                <VideoPlayer />
            </Suspense>
        </div>
    );
}