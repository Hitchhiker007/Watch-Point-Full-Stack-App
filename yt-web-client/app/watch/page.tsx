'use client';

import styles from "./watch.module.css";
import { useSearchParams } from "next/navigation";

export default function Watch() {

    const videoPrefix = 'https://storage.googleapis.com/major-will-processed-videos/';
    const videoSource = useSearchParams().get('v');

    return (
        <div className={styles.container}>
            <h1>Watch Page</h1>
            <div className={styles.videoPlayer}>
                <video controls width="640" height="360">
                    <source src={videoPrefix + videoSource} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}