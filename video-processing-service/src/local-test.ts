import { setupDirectories, convertVideo } from "./storage";
import { generateThumbnail } from "./thumbnailGeneration";

async function runLocalTest() {
  // ensure the folders exist
  setupDirectories();

  const inputFileName = "test.mp4"; // ./raw-videos
  const outputFileName = `processed-${inputFileName}`;
    // thumbnail
  const thumbnailFileName = `thumb-${inputFileName.replace(".mp4", ".jpg")}`;

  try {
    console.log("Starting local video processing...");
    await convertVideo(inputFileName, outputFileName);

    console.log("Generating thumbnail...");
    await generateThumbnail(inputFileName, thumbnailFileName);


    console.log(`Done! Check ./processed-videos/${outputFileName} and /thumbnails`);
  } catch (err) {
    console.error("Processing failed:", err);
  }
}

runLocalTest();

// easy command for ffmpeg
// ffmpeg -i input.mp4 -ss 00:00:01.000 -vframes 1 output.png
