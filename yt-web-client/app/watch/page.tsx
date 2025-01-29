'use client';

import styles from "./watch.module.css";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from 'react';

const VideoPlayer = () => {

    const videoPrefix = 'https://storage.googleapis.com/major-will-processed-videos/';


    // Call useSearchParams directly at the top of your component
    const searchParams = useSearchParams();
    const videoParam = searchParams.get('v'); // Get the 'v' query parameter

    // Set up state to store video source once it's available
    const [videoSource, setVideoSource] = useState<string | null>(null);

    useEffect(() => {
        if (videoParam) {
            setVideoSource(videoParam); // Update state with the video source
        }
    }, [videoParam]); // Dependency on videoParam

    if (!videoSource) {
        return <div>Loading video...</div>;
    }

    return (
        <div className={styles.videoPlayer}>
            <video controls width="640" height="360">
                <source src={videoPrefix + videoSource} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default function Watch() {
    return (
        <div className={styles.container}>
            <h1>Watch Page</h1>
            <Suspense fallback={<div>Loading video...</div>}>
                <VideoPlayer />
            </Suspense>
        </div>
    );
}