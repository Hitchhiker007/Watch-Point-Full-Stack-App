"use client";

import Image from "@/node_modules/next/image";
import Link from 'next/link';
import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Upload from './upload';


export default function Navbar() {
    // Init user state
    // managing state in function
    // javascript closure to research
    // state within a funciton is still mantained after a function has been executed
    const [user, setUser] = useState<User | null>(null);
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });

        // Update body class for dark mode
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // cleanup subscription on unmount
        return () => unsubscribe();
    }, [darkMode]);

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };


    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image width={90} height={20}
                    className={styles.logo}
                    src="/youtube-logo.svg" alt="youtube-logo"></Image>
            </Link>

            {
                // if user evalautes to true render the upload button
                user && <Upload />
            }

            {/* Navigation Links */}
            <ul className={styles.navLinks}>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/">Watch</Link>
                </li>
                <li>
                    <Link href="/my-page">My Page</Link>
                </li>
                <li>
                    <Link href="/account">Account</Link>
                </li>
                <li>
                    <Link href="/settings">Settings</Link>
                </li>
            </ul>

            {/* Dark Mode Button */}
            <button onClick={toggleDarkMode} className={`${styles.darkModeButton} ${darkMode ? styles.lightButton : styles.darkButton}`}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            <SignIn user={user} />
        </nav >
    );
}
