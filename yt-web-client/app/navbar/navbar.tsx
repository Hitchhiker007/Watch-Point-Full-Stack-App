import Image from "@/node_modules/next/image";
import Link from 'next/link';
import styles from "./navbar-module.css";


export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link href="/">
                <span className={styles.logoContainer}>
                    <Image width={90} height={20}
                        className={styles.logo}
                        src="/youtube-logo.svg" alt="youtube-logo"></Image>
                </span>
            </Link>
        </nav>
    );
}