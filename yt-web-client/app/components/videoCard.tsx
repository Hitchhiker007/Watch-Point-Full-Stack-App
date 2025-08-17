"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Video, getVideos } from "../firebase/functions";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase/firebase";
import styles from "./VideoCard.module.css";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [meta, setMeta] = useState<Partial<Video>>({});

  useEffect(() => {
    async function fetchMeta() {
      if (!video.filename) return;

      try {
        const firestore = getFirestore(app);
        const processingDocId = video.filename.replace(/^processed-/, '');
        const docRef = doc(firestore, "videos", processingDocId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMeta(docSnap.data() as Partial<Video>);
        }
      } catch (err) {
        console.error("Error fetching video meta:", err);
      }
    }

    fetchMeta();
  }, [video.filename]);

  if (!video.filename) return null;

  return (
    <Link href={`/watch?v=${video.filename}`} className={styles.videoCard}>
      <Image
        src="/thumbnail.png"
        alt={meta.title || video.title || "Untitled"}
        width={120}
        height={80}
        className={styles.thumbnail}
      />
      <div className={styles.meta}>
        <div className={styles.title}>{meta.title || video.title || "Untitled"}</div>
        {meta.genre && <div className={styles.genre}>{meta.genre}</div>}
      </div>
    </Link>
  );
}
