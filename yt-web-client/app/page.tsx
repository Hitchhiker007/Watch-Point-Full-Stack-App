import { getVideos } from "./firebase/functions";
import styles from './page.module.css'
import Image from 'next/image';
import Link from 'next/link';


export default async function Home() {

  // TODO:
  // add filter to filter out videos still processing
  const videos = await getVideos();

  return (
    <main>
      {
        videos.map((video) => (
          // Use `video.id` or `video.filename` as the key for each video div
      <div key={video.id || video.filename}> 
          <Link href={`/watch?v=${video.filename}`}>
            <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
              className={styles.thumbnail} />
          </Link>
          {/* Video Title */}
          <div className={styles.title}>{video.filename}</div> {/* Display video title */}
          </div>
        ))
      }
    </main>
  );
}

export const revalidate = 30;
