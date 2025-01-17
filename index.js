const express = require("express");
const multer = require("multer");

const { overlayEmoji } = require("./imageUtils"); // Import the function

const app = express();
const port = process.env.PORT || 8080;

// Setup multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// Endpoint to upload an image and overlay emoji
app.post("/overlay-emoji", upload.single("image"), async (req, res) => {
  const emojiPath = "emoji.png";

  try {
    const outputBuffer = await overlayEmoji(req.file.path, emojiPath);

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
