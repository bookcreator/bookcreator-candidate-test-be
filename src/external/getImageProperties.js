import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

export const getDominantColors = async (imageUrl) => {
  const [result] = await client.imageProperties(imageUrl);
  return result.imagePropertiesAnnotation.dominantColors.colors;
};
