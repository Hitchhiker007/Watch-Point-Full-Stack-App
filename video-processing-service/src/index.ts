import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
const port = 3000;

app.post("/process-video", (req, res) => {
    //Get path of the input video file from request body
    const inputFilePath = req.body.inputFilePath;

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});