import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
// specify that our server is using json
app.use(express.json());

app.post("/process-video", (req, res) => {
    //Get path of the input video file from request body
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    // error handling
    // error message 400 means its client sided, gave the wrong params / request
    if (!inputFilePath) {
        res.status(400).send("Bad Request: Missing input file path.");
    }
    if (!outputFilePath) {
        res.status(400).send("Bad Request: Missing output file path.");
    }

    ffmpeg(inputFilePath)
        .outputOptions("-vf", "scale=-1:360")//360p
        .on("end", () => {
            res.status(200).send("Processing finished successfully.")
        })
        .on("error", (err) => {
            console.log(`An error occured: ${err.message}`);
            res.status(500).send(`Internal Server Error: ${err.message}`);
        })
        .save(outputFilePath);
});

// important
// if the environment port is undefined it is set to port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});