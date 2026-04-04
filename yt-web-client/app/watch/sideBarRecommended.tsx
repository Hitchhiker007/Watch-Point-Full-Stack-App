"use client";

import { useEffect, useState } from "react";
import { getVideos, Video } from "../firebase/functions"; 
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase/firebase";
import VideoCard from "../components/videoCard"; // <-- import your VideoCard
import styles from "./watch.module.css"; 
import Image from "next/image";
import Link from "next/link";

export default function SidebarRecommended() {
  const [videos, setVideos] = useState<Video[]>([]);
  const firestore = getFirestore(app);

  useEffect(() => {
    async function fetchVideosWithMeta() {
      try {
        const allVideos = await getVideos();
        const processedVideos = allVideos.filter((v) => v.status === "processed" && v.filename);

        const videosWithMeta = await Promise.all(
          processedVideos.map(async (video) => {
            if (!video.filename) return video;
            const processingDocId = video.filename.replace(/^processed-/, '');
            const processingDocRef = doc(firestore, "videos", processingDocId);
            const docSnap = await getDoc(processingDocRef);
            if (docSnap.exists()) {
              return { ...video, ...docSnap.data() };
            }
            return video;
          })
        );

        setVideos(videosWithMeta.filter((v): v is Video => v !== null));
      } catch (error) {
        console.error("Error fetching recommended videos:", error);
      }
    }

    fetchVideosWithMeta();
  }, [firestore]);

 return (
    <aside className={styles.sidebar}>
      {/* <div className={styles.recommendedTitle}>Recommended</div> */}
      <div className={styles.recommended}>
        {videos.map((video) => (
          <Link
            key={video.id || video.filename}
            href={`/watch?v=${video.filename}`}
            className={styles.recommendedCard}
          >
            <Image
              src={video.thumbnails?.[0] || "/thumbnail.png"}
              alt={video.title || "Untitled"}
              width={120}
              height={68}
              className={styles.recommendedThumbnail}
              unoptimized
            />
            <div className={styles.recommendedInfo}>
              <div className={styles.recommendedTitle_text}>{video.title || "Untitled"}</div>
              {video.genre && <div className={styles.recommendedGenre}>{video.genre}</div>}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
