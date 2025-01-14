'use client';
// convert to a client side component

import { Fragment } from "react";

import { signInWithGoogle, signOut } from "../firebase/firebase";
import styles from './sign-in.module.css';
import { User } from "firebase/auth";

// define interface to set user to either user or null
interface SignInProps {
    user: User | null;
}

// take in a single object user
// destructing assignment
export default function SignIn({ user }: SignInProps) {
    return (
        <Fragment>
            {user ?
                (
                    <button className={styles.signin} onClick={signOut}>
                        Sign Out
                    </button>
                ) : (
                    <button className={styles.signin} onClick={signInWithGoogle}>
                        Sign In
                    </button>
                )
            }
        </Fragment>
    )
}