import { getVideos } from "./firebase/functions";
import styles from './page.module.css'


export default async function Home() {

  const videos = await getVideos();

  console.log(videos);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p>This is Page.tsx</p>
      </main>
    </div>
  );
}
