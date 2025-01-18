const { ImageAnnotatorClient } = require("@google-cloud/vision");
const sharp = require("sharp");

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

  // Load the original image
  let image = sharp(imageBuffer);

  // Load the emoji image
  await sharp(emojiPath).ensureAlpha().toBuffer();

  for (const face of faces) {
    const bbox = face.boundingPoly;
    const x1 = bbox.vertices[0].x;
    const y1 = bbox.vertices[0].y;
    const x2 = bbox.vertices[2].x;
    const y2 = bbox.vertices[2].y;

    // Calculate face center and size
    const faceCenterX = (x1 + x2) / 2;
    const faceCenterY = (y1 + y2) / 2;
    const faceWidth = x2 - x1;

    // Resize emoji based on face width
    const resizedEmoji = await sharp(emojiPath).resize(faceWidth).toBuffer();

    // Position the emoji at the face center
    const emojiX = faceCenterX - faceWidth / 2;
    const emojiY = faceCenterY - faceWidth / 2;

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
