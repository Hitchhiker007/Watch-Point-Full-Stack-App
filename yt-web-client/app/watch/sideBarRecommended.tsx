"use client";

import { useEffect, useState } from "react";
import { getVideos, Video } from "../firebase/functions"; 
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase/firebase";
import VideoCard from "../components/videoCard"; // <-- import your VideoCard
import styles from "./watch.module.css"; 

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
      <div className={styles.recommended}>
        {videos.map((video) => (
          <VideoCard key={video.id || video.filename} video={video} />
        ))}
      </div>
    </aside>
  );
}
