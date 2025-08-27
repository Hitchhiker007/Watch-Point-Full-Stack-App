"use client";

import Image from "@/node_modules/next/image";
import Link from 'next/link';
import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
// import Upload from './upload';
import { getPhotoUrl } from "../firebase/functions";




export default function Navbar() {
    // Init user state
    // managing state in function
    // javascript closure to research
    // state within a funciton is still mantained after a function has been executed
    const [user, setUser] = useState<User | null>(null);
    // const [darkMode, setDarkMode] = useState<boolean>(false);
    const [photoURL, setPhotoURL] = useState<string | null>(null); // State to store photo URL

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
                } else {
                    console.log("photo url is NULL");
                    setPhotoURL(null);
                }
            });

            // Cleanup subscription on unmount
            return () => unsubscribe();
        }); // Only re-run effect if darkMode changes
    
        // const toggleDarkMode = () => {
        //     setDarkMode(!darkMode);
        // };

        // Fallback/default image for signed-out users
        const defaultImage = '/default_user.png'; // Update this with your default image path
    

    return (
        <nav className={styles.nav}>
            <div className={styles.navLeft}>
            <Link href="/">
                <Image width={90} height={40}
                    className={styles.logo}
                    src="/logo.svg" alt="ogo"></Image>
            </Link>


            {/* redundant with form upload */}
            {/* {
                // if user evalautes to true render the upload button
                user && <Upload />
            } */}

            {/* Navigation Links */}
            <ul className={styles.navLinks}>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/upload">Upload</Link>
                </li>
                {/* <li>
                    <Link href="/my-page">My Page</Link>
                </li> */}
                <li>
                    <Link href="/account">Account</Link>
                </li>
                {/* <li>
                    <Link href="/settings">Settings</Link>
                </li> */}
            </ul>
             </div>

            {/* TODO: Dark Mode Button */}

            {/* Dark Mode Button */}
            {/* <button onClick={toggleDarkMode} className={`${styles.darkModeButton} ${darkMode ? styles.lightButton : styles.darkButton}`}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button> */}

            
                <div className={styles.userProfileContainer}>
                    <Image
                        src={user ? (photoURL || defaultImage) : defaultImage}
                        alt="User Profile"
                        width={40}
                        height={40}
                        className={styles.profileImage}
                        unoptimized
                    />
                    <SignIn user={user} />
                    </div>
        </nav >
    );
}
