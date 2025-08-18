import ffmpeg from "fluent-ffmpeg";
import path from "path";

const localThumbnailPath = "./thumbnails";

export function generateThumbnail(videoName: string, outputImage: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(`./raw-videos/${videoName}`)
      .on("end", () => {
        console.log(`Thumbnail created at ${path.join(localThumbnailPath, outputImage)}`);
        resolve();
      })
      .on("error", (err) => {
        console.error("Error generating thumbnail:", err);
        reject(err);
      })
      // frame at 3 seconds in
      .screenshots({
        timestamps: ["3"],
        filename: outputImage,
        folder: localThumbnailPath,
        size: "640x360"
      });
  });
}
