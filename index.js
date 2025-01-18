const express = require("express");

const { overlayEmoji } = require("./imageUtils"); // Import the function

const app = express();
// Middleware to parse incoming JSON request bodies
app.use(express.json());

const port = process.env.PORT || 8080;

// Endpoint to upload an image and overlay emoji
app.post("/overlay-emoji", async (req, res) => {
  const { imageUrl } = req.body; // Expect the image URL in the request body

  try {
    const outputBuffer = await overlayEmoji(imageUrl);

    res.set("Content-Type", "image/jpeg");
    res.send(outputBuffer);
  } catch (err) {
    console.error("Error processing image:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
