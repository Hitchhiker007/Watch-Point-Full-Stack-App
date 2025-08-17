import { getVideos } from "./firebase/functions";
import styles from './page.module.css'
import Image from 'next/image';
import Link from 'next/link';
import VideoCard from "./components/videoCard";

export default async function Home() {

  // TODO:
  // add filter to filter out videos still processing
  const videos = await getVideos();

  return (
    <main>
    {videos.map(v => <VideoCard key={v.id || v.filename} video={v} />)}
    </main>
  );
}

export const revalidate = 30;
