import express, { Request, Response, RequestHandler } from 'express';

import {
    uploadProcessedVideo,
    downloadRawVideo,
    deleteRawVideo,
    deleteProcessedVideo,
    convertVideo,
    setupDirectories
} from './storage';

// Create the local directories for videos
setupDirectories();

// Process a video file from Cloud Storage into 360p
const processVideoHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        // Parse the Pub/Sub message
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        const data = JSON.parse(message);

        if (!data.name) {
            res.status(400).send('Bad Request: missing filename.');
            return;
        }

        const inputFileName = data.name;
        const outputFileName = `processed-${inputFileName}`;

        // Download the raw video from Cloud Storage
        await downloadRawVideo(inputFileName);

        // Process the video into 360p
        try {
            await convertVideo(inputFileName, outputFileName);
        } catch (err) {
            console.error('Error processing video:', err);
            await Promise.all([
                deleteRawVideo(inputFileName),
                deleteProcessedVideo(outputFileName),
            ]);
            res.status(500).send('Processing failed');
            return;
        }

        // Upload the processed video to Cloud Storage
        await uploadProcessedVideo(outputFileName);

        // Cleanup local files
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName),
        ]);

        res.status(200).send('Processing finished successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

const app = express();
app.use(express.json());

app.post('/process-video', processVideoHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
