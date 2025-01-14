// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAdQz-u_V7TBQn7NbtFMdwE2HLchgs1518",
    authDomain: "yt-clone-dbda9.firebaseapp.com",
    projectId: "yt-clone-dbda9",
    storageBucket: "yt-clone-dbda9.firebasestorage.app",
    messagingSenderId: "900418942079",
    appId: "1:900418942079:web:ae62ff0b488707d81b3b4a",
    measurementId: "G-24TDZQ8570"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut() {
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}