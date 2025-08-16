"use client";

import { getPhotoUrl, getUserEmail } from "../firebase/functions";
import { useEffect, useState } from "react";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import styles from "./account.module.css";
import Image from "@/node_modules/next/image";
import { User } from "firebase/auth";

export default function Account(){

    const [user, setUser] = useState<User | null>(null);
    const [photoURL, setPhotoURL] = useState<string | null>(null); // State to store photo URL
    const [email, setUserEmail] = useState<string | null>(null);

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
                } else {
                    console.log("photo url is NULL");
                    console.log("user email is NULL")
                    setPhotoURL(null);
                    setUserEmail(null);
                }
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
    })

    const defaultImage = '/TheThing.png';
    const defaultEmail = '';

    // setUser(user);

    return (
        <div className={styles.userProfile}>
                    <Image
                        src={user ? (photoURL || defaultImage) : defaultImage}
                        alt="User Profile"
                        width={200}
                        height={200}
                        className={styles.profileImage}
                    />
                    <h2>{user ? (email || defaultEmail) : defaultEmail}</h2>

                </div>
    )

};