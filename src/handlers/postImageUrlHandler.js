import { getImageProperties } from "../external/getImageProperties.js";

export const postImageUrlHandler = async (req, res) => {
  const { imageUrl } = req.body;
  const imageProperties = await getImageProperties(imageUrl);
  res.send({imageProperties});
};
