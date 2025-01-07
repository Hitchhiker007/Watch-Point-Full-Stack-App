import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
const port = 3000;

app.post("/process-video", (req, res) => {
    //Get path of the input video file from request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    // error handling
    // error message 400 means its client sided, gave the wrong params / request
    if (!inputFilePath) {
        res.status(400).send("Bad Request: Missing input file path.")
    }
    if (!outputFilePath) {
        res.status(400).send("Bad Request: Missing output file path.")
    }

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});