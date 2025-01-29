import { getVideos } from "./firebase/functions";
import styles from './page.module.css'
import Image from 'next/image';
import Link from 'next/link';


export default async function Home() {

  const videos = await getVideos();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {
          videos.map((video) => (
            <Link href={`/watch?v=${video.filename}`}>
              <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
                className={styles.thumbnail} />
            </Link>
          ))
        }
      </main>
    </div>
  );
}
