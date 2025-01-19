export const postImageUrlHandler = (req, res) => {
  const { imageUrl } = req.body;
  res.send({imageUrl});
};
