"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Video } from "../firebase/functions";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase/firebase";
import styles from "./VideoCard.module.css";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [meta, setMeta] = useState<Partial<Video>>({});
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [uploaderPhoto, setUploaderPhoto] = useState<string>("/default_user.png");
  // const [uploaderName, setUploaderName] = useState<string>("Unknown");

  useEffect(() => {
    const firestore = getFirestore(app);

    async function fetchMeta() {
      if (!video.filename) return;

      try {
        // Existing meta fetch
        const processingDocId = video.filename.replace(/^processed-/, '');
        const docRef = doc(firestore, "videos", processingDocId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMeta(docSnap.data() as Partial<Video>);
        }

        // Additional thumbnail fetch (from doc without .mp4)
        const metadataDocId = video.filename.replace(/^processed-/, "").replace(/\.mp4$/, "");
        const metadataDocRef = doc(firestore, "videos", metadataDocId);
        const metadataDocSnap = await getDoc(metadataDocRef);

        if (metadataDocSnap.exists()) {
          const data = metadataDocSnap.data() as Partial<Video>;
          if (data.thumbnails?.[0]) {
            setThumbnailUrl(data.thumbnails[0]); // set separate thumbnail
          }
        }
        if (video.uid) {
        const userRef = doc(firestore, "users", video.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUploaderPhoto(userData?.photoUrl || "/default_user.png");
          // setUploaderName(userData?.diplsayName || "Unknown");
        }
      }
      } catch (err) {
        console.error("Error fetching video meta or thumbnail:", err);
      }
    }

    fetchMeta();
  }, [video.filename, video.uid]);

  if (!video.filename) return null;


  return (
    <Link href={`/watch?v=${video.filename}`} className={styles.videoCard}>
      <Image
        src={thumbnailUrl || "/thumbnail.png"}
        alt={meta.title || video.title || "Untitled"}
        width={175}
        height={100}
        className={styles.thumbnail}
      />
      <div className={styles.meta}>
        <Image
          src={uploaderPhoto}
          alt="Uploader avatar"
          className={styles.uploaderImage}
          width={32}
          height={32}
        />
        <div className={styles.text}>
          <div className={styles.title}>{meta.title || video.title || "Untitled"}</div>
          {meta.genre && <div className={styles.genre}>{meta.genre}</div>}
        </div>
      </div>
    </Link>
  );
}
