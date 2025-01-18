const { ImageAnnotatorClient } = require("@google-cloud/vision");
const sharp = require("sharp");
const axios = require("axios");

const emojiPath = "assets/emoji.png";

async function detectFaces(imagePath) {
  const client = new ImageAnnotatorClient();
  const [result] = await client.faceDetection(imagePath);
  return result.faceAnnotations;
}

async function overlayEmoji(imagePath) {
  // Step 1: Download the image from the URL
  const response = await axios({
    url: imagePath,
    responseType: "arraybuffer", // Ensure the image data is received as a buffer
  });

  const imageBuffer = Buffer.from(response.data);

  // Detect faces
  const faces = await detectFaces(imagePath);
  if (faces.length === 0) {
    throw new Error("No faces detected");
  }
  if (faces.length > 1) {
    throw new Error("Too many faces detected");
  }

  // Load the original image
  const baseImageBuffer = await sharp(imageBuffer)
    .ensureAlpha() // Ensure the base image has transparency
    .toBuffer();

  const bbox = faces[0].boundingPoly;
  const x1 = bbox.vertices[0].x;
  const y1 = bbox.vertices[0].y;
  const x2 = bbox.vertices[2].x;
  const y2 = bbox.vertices[2].y;

  // Calculate face center and size
  const faceCenterX = (x1 + x2) / 2;
  const faceCenterY = (y1 + y2) / 2;
  const faceWidth = x2 - x1;

  // Resize emoji based on face width
  const resizedEmojiBuffer = await sharp(emojiPath)
    .resize(faceWidth)
    .ensureAlpha() //Ensure the png transparent background is honoured
    .toBuffer();

  // Position the emoji at the face center
  const emojiX = faceCenterX - faceWidth / 2;
  const emojiY = faceCenterY - faceWidth / 2;

  // Composite the emoji on top of the base image with transparency handling
  const outputBuffer = await sharp(baseImageBuffer)
    .composite([
      {
        input: resizedEmojiBuffer, // Emoji image buffer with transparency
        top: Math.round(emojiY), // Y-position
        left: Math.round(emojiX), // X-position
        blend: "over", // Default blend mode (overlays with transparency)
      },
    ])
    .toBuffer();

  return outputBuffer; // Return the processed image buffer
}

// Export the async function for use in other files
module.exports.overlayEmoji = overlayEmoji;
