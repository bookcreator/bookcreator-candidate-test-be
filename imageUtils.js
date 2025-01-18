const { ImageAnnotatorClient } = require("@google-cloud/vision");
const sharp = require("sharp");
const axios = require("axios");

const emojiPath = "assets/emoji.png";

async function detectFaces(imagePath) {
  const client = new ImageAnnotatorClient();
  const [result] = await client.faceDetection(imagePath);
  return result.faceAnnotations;
}

async function calculatePosition(bbox, emojiWidth) {
  const faceCenterX = (bbox[0].x + bbox[2].x) / 2;
  const faceCenterY = (bbox[0].y + bbox[2].y) / 2;
  const emojiX = faceCenterX - emojiWidth / 2;
  const emojiY = faceCenterY - emojiWidth / 2;
  return { x: emojiX, y: emojiY };
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

  // Load the original image
  let image = sharp(imageBuffer)
    .ensureAlpha() // Ensure the base image has an alpha channel (transparency)
    .toBuffer();

  for (const face of faces) {
    const bbox = face.boundingPoly;
    const faceWidth = bbox.vertices[2].x - bbox.vertices[0].x;

    // Resize emoji based on face width
    const resizedEmoji = await sharp(emojiPath)
      .ensureAlpha() //Ensure the png transparent background is honoured
      .resize(faceWidth)
      .toBuffer();

    // Calculate position for emoji
    const { x: emojiX, y: emojiY } = await calculatePosition(
      bbox,
      resizedEmoji.width
    );

    // Overlay the emoji on the image
    image = image.composite([
      {
        input: resizedEmoji,
        top: Math.round(emojiY),
        left: Math.round(emojiX),
        blend: "over",
      },
    ]);
  }

  return image.toBuffer();
}

// Export the async function for use in other files
module.exports.overlayEmoji = overlayEmoji;
