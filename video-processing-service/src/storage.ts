import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
// import path from "path";

const storage = new Storage();

const rawVideoBucketName = "major-will-raw-videos";
const processedVideoBucketName = "major-will-processed-videos";
// const thumbnailBucketName = "major-will-thumbnails";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";
// const localThumbnailPath = "./thumbnails";

// Create local directories for raw and processed videos
export function setupDirectories() {
    ensureDirectoryExistance(localRawVideoPath);
    ensureDirectoryExistance(localProcessedVideoPath);
    // ensureDirectoryExistance(localThumbnailPath);
}

/**
 * @param rawVideoName - The name of the file to convert from {@link localRawVideoPath}.
 * @param processedVideoName - The name of the file to convert to {@link localProcessedVideoPath}.
 * @returns A promise that resolves when the video has been converted.
 */

export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions("-vf", "scale=-1:360")//360p
            .on("end", () => {
                console.log("Processing finished successfully.");
                resolve();
            })
            .on("error", (err) => {
                console.log(`An error occured: ${err.message}`);
                reject(err);
            })
            .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}


/**
 * @param fileName - The name of the file to download from the 
 * {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been downloaded.
 */

// this returns a promise since it is an asynchonous function
// we need to declare await so console.log() displays after it has been resolved
export async function downloadRawVideo(fileName: string) {
    await storage.bucket(rawVideoBucketName)
        .file(fileName)
        .download({ destination: `${localRawVideoPath}/${fileName}` });
    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`
    );
}

/**
 * @param fileName - The name of the file to upload from the 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */

export async function uploadProcessedVideo(fileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);
    // Upload video to the bucket
    await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
        destination: fileName
    });
    console.log(`${localProcessedVideoPath}/${fileName} uploaded to gs://${processedVideoBucketName}/${fileName}.`);

    await bucket.file(fileName).makePublic();
}

/**
 * @param fileName - The name of the file to delete from the
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted.
 * 
 */
export function deleteRawVideo(fileName: string) {
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}


/**
* @param fileName - The name of the file to delete from the
* {@link localProcessedVideoPath} folder.
* @returns A promise that resolves when the file has been deleted.
* 
*/
export function deleteProcessedVideo(fileName: string) {
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}


/**
 * @param filePath - The path of the file to delete.
 * @returns A promise that resolves when the file has been deleted.
 */
function deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Failed to delete file at ${filePath}`, err);
                    reject(err);
                } else {
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            });
        } else {
            console.log(`File not found at ${filePath}, skipping delete.`);
            resolve();
        }
    });
}


/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */
function ensureDirectoryExistance(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true }); // recursive: true enables creating nested directories
        console.log(`Directory created at ${dirPath}`);
    }
}

// // ------------------ Thumbnails ------------------

// export function generateThumbnail(videoName: string, videoId: string, outputImage: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     ffmpeg(`${localRawVideoPath}/${videoName}`)
//       .on("end", async () => {
//         console.log(`Thumbnail created: ${localThumbnailPath}/${outputImage}`);
//         resolve(`${localThumbnailPath}/${outputImage}`);
//       })
//       .on("error", (err) => {
//         console.error("Error generating thumbnail:", err);
//         reject(err);
//       })
//       .screenshots({
//         timestamps: ["3"],
//         filename: outputImage,
//         folder: localThumbnailPath,
//         size: "320x240"
//       });
//   });
// }

// export async function uploadThumbnail(localPath: string, videoId: string, thumbFile: string) {
//   const bucket = storage.bucket(thumbnailBucketName);
//   const destination = `${videoId}/${thumbFile}`; // store under folder named by videoId

//   await bucket.upload(localPath, { destination });
//   console.log(`Thumbnail uploaded to gs://${thumbnailBucketName}/${destination}`);

//   // make public
//   await bucket.file(destination).makePublic();
//   return `https://storage.googleapis.com/${thumbnailBucketName}/${destination}`;
// }