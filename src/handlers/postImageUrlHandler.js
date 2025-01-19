import { getDominantColors } from "../external/getImageProperties.js";
import { formatDominantColours } from "../logic /formatDominantColours.js";

export const postImageUrlHandler = async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl || typeof imageUrl !== "string") {
    res
      .status(400)
      .send({ error: "imageUrl is required and must be a string" });
  }

  try {
    const dominantColors = await getDominantColors(imageUrl);
    const humanReadableDominantColors = formatDominantColours(dominantColors);
    res.send({ colors: humanReadableDominantColors });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "There was an issue getting colors for your image" });
  }
};
