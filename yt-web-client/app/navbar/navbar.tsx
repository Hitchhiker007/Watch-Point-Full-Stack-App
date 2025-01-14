import Image from "@/node_modules/next/image";
import Link from 'next/link';
import styles from "./navbar-module.css";
import SignIn from "./sign-in";


export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image width={90} height={20}
                    className={styles.logo}
                    src="/youtube-logo.svg" alt="youtube-logo"></Image>
            </Link>
            <SignIn />
        </nav>
    );
}