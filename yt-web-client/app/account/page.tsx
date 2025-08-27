"use client";

import { getPhotoUrl, getUserEmail, getUserVideos } from "../firebase/functions";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import styles from "./account.module.css";
import Image from "@/node_modules/next/image";
import { User } from "firebase/auth";
import VideoCard from "../components/videoCard";

export default function Account(){

    const [user, setUser] = useState<User | null>(null);
    const [photoURL, setPhotoURL] = useState<string | null>(null); // State to store photo URL
    const [email, setUserEmail] = useState<string | null>(null);
    const [videos, setVideos] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
            if (user) {
                // Fetch the user's photo URL when signed in
                getPhotoUrl()
                    .then((url) => {
                        setPhotoURL(url); // Set photo URL in state
                    })
                    .catch((error) => { console.log(error)
                    });
                getUserEmail()
                    .then((email) => {
                        setUserEmail(email);
                    })
                    .catch((error) => { console.log(error)
                    });

                // Fetch user videos
                getUserVideos().then(setVideos).catch(console.error);
                } else {
                    console.log("photo url is NULL");
                    console.log("user email is NULL")
                    setPhotoURL(null);
                    setUserEmail(null);
                    // clear videos on sign-out, array was filled with videos of previous user 
                    // so you could see their videos for a split second
                    setVideos([]);
                }
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
    })

    const defaultImage = '/default_user.png';
    const defaultEmail = '';

    return (
        <div className={styles.accountPage}>
            <div className={styles.userProfile}>
            <Image
                src={user ? (photoURL || defaultImage) : defaultImage}
                alt="User Profile"
                width={120}
                height={120}
                className={styles.profileImage}
            />
            <h2 className={styles.userEmail}>
                {user ? (email || defaultEmail) : defaultEmail}
            </h2>
            </div>
                <h3 className={styles.heading}>
                    {user ? "Your Videos" : "Sign in to see your videos"}
                </h3>
           {user && (
            <div className={styles.mainGrid}>
                {videos.map(v => (
                <VideoCard key={v.id || v.filename} video={v} />
                ))}
            </div>
            )}
        </div>
    );

};