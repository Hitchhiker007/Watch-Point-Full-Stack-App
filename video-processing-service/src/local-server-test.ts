import axios from "axios";

// The local Express endpoint
const url = "http://localhost:3000/process-video";

// Name of the test video in ./raw-videos
const testVideo = "test.mp4";

// Build the Pub/Sub-like message
const pubSubMessage = {
  message: {
    data: Buffer.from(JSON.stringify({ name: testVideo })).toString("base64")
  }
};

async function simulatePubSub() {
  try {
    const response = await axios.post(url, pubSubMessage, {
      headers: { "Content-Type": "application/json" }
    });

    console.log("Response from server:", response.data);
  } catch (err: any) {
    console.error("Error calling server:", err.response?.data || err.message);
  }
}

simulatePubSub();
