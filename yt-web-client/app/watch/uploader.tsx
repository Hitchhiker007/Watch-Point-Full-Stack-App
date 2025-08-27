"use client";

import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebase"; // your initialized functions
import Image from "next/image";
import styles from "./uploader.module.css";

interface VideoUploaderProps {
  uploaderUid: string;
}

export default function VideoUploader({ uploaderUid }: VideoUploaderProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
  if (!uploaderUid) return;

  const getUploaderInfoFn = httpsCallable<{ uid: string }, { email: string; photoURL: string }>(
    functions,
    "getUploaderInfo"
  );

  getUploaderInfoFn({ uid: uploaderUid })
    .then((result) => {
      const { email, photoURL } = result.data;
      setEmail(email);
      setPhotoURL(photoURL);
    })
    .catch((err) => {
      console.log("Error fetching uploader info:", err);
      setEmail(null);
      setPhotoURL(null);
    });
}, [uploaderUid]);

  const defaultImage = "/default_user.png";
  const defaultEmail = "Unknown uploader";

  return (
    <div className={styles.userProfile}>
      <Image
        src={photoURL || defaultImage}
        alt="Uploader Profile"
        width={75}
        height={75}
        className={styles.profileImage}
        unoptimized
      />
      <h2> Channel: {email || defaultEmail}</h2>
    </div>
  );
}
