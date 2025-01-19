import { getDominantColors } from "../external/getImageProperties.js";
import { createColorWheel } from "../logic/createColorWheel.js";
import { formatDominantColours } from "../logic/formatDominantColours.js";

export const postImageUrlHandler = async (req, res) => {
  const { imageUrl } = req.body;
  const { colorWheel } = req.query;
  if (!imageUrl || typeof imageUrl !== "string") {
    res
      .status(400)
      .send({ error: "imageUrl is required and must be a string" });
  }

  try {
    const dominantColors = await getDominantColors(imageUrl);
    const humanReadableDominantColors = formatDominantColours(dominantColors);

    if (colorWheel && JSON.parse(colorWheel)) {
      const colourWheelPng = createColorWheel(humanReadableDominantColors, 100);
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="color-wheel.png"',
      );
      res.setHeader("Content-Type", "image/png");
      return res.send(colourWheelPng);
    }

    return res.send({ colors: humanReadableDominantColors });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: "There was an issue getting colors for your image" });
  }
};
