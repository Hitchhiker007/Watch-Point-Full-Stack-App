"use client";

import Image from "@/node_modules/next/image";
import Link from 'next/link';
import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";


export default function Navbar() {
    // Init user state
    // managing state in function
    // javascript closure to research
    // state within a funciton is still mantained after a function has been executed
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });

        // cleanup subscription on unmount
        return () => unsubscribe();
    });

    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image width={90} height={20}
                    className={styles.logo}
                    src="/youtube-logo.svg" alt="youtube-logo"></Image>
            </Link>

            {/* Navigation Links */}
            <ul className={styles.navLinks}>
                <li>
                    <Link href="/">Home</Link>
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

            {/* // TODO: Add a upload button */}

            <SignIn user={user} />
        </nav>
    );
}