import express, { Request, Response, RequestHandler } from 'express';
import { isVideoNew, setVideo } from './firestore';
import { getVideo } from './firestore';
import fs from 'fs';

import {
    uploadProcessedVideo,
    downloadRawVideo,
    deleteRawVideo,
    deleteProcessedVideo,
    convertVideo,
    setupDirectories,
    generateThumbnail,
    uploadThumbnail
} from './storage';

// Create the local directories for videos
setupDirectories();

// Process a video file from Cloud Storage into 360p
const processVideoHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    let data;
    try {
        // parse the Pub/Sub message
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data = JSON.parse(message);

        if (!data.name) {
            res.status(400).send('Bad Request: missing filename.');
            return;
        }

        const inputFileName = data.name; // Format of <UID>-<DATE>.<EXTENSION>
        const outputFileName = `processed-${inputFileName}`;
        const videoId = inputFileName.split('.')[0];


        if (!isVideoNew(videoId)) {
            res.status(400).send('Bad Request: video already processing or processed.');
        } else {
            await setVideo(videoId, {
                id: videoId,
                uid: videoId.split('-')[0],
                status: 'processing'
            });
        }

        // Download the raw video from Cloud Storage
        await downloadRawVideo(inputFileName);

        // Process the video into 360p
        try {
            await convertVideo(inputFileName, outputFileName);
        } catch (err) {
            const error = err as Error; // Type assertion here
            console.error('Error processing video:', error);
            await Promise.all([
                deleteRawVideo(inputFileName),
                deleteProcessedVideo(outputFileName),
            ]);
            res.status(500).send(`Processing failed: ${error.message || error}`);
            return;
        }

        // Upload the processed video to Cloud Storage
        await uploadProcessedVideo(outputFileName);

        const existingVideo = await getVideo(videoId);

        // ---------------- Thumbnail generation ----------------
        const thumbFile = `thumb-${videoId}.jpg`;
        const localThumbPath = await generateThumbnail(inputFileName, videoId, thumbFile);
        const publicThumbUrl = await uploadThumbnail(localThumbPath, videoId, thumbFile);

        // Save Video
        // Thumbanil in firestore also

        await setVideo(videoId, {
             ...existingVideo,
            status: 'processed',
            filename: outputFileName,
            thumbnails: [publicThumbUrl] // thumbnails
        })

        // Cleanup local files
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName),
            fs.promises.unlink(localThumbPath) // also delete local thumbnail
        ]);

        res.status(200).send('Processing finished successfully');
    } catch (err) {
        const error = err as Error; // Type assertion here
        console.error('Error:', error);
        res.status(500).send(`Internal Server Error: ${error.message || error}`);
    }
};

const app = express();
app.use(express.json());

app.post('/process-video', processVideoHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
