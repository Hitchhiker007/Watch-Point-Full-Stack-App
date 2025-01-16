import styles from "./watch.module.css";

export default function Watch() {
    return (
        <div className={styles.container}>
            <h1>Watch Page</h1>
            <div className={styles.videoPlayer}>
                <video controls width="640" height="360">
                    <source src="/sample-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}