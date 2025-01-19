import express from "express";
import "dotenv/config";
import { postImageUrlHandler } from "./handlers/postImageUrlHandler.js";
const app = express();
const port = parseInt(process.env.PORT) || 8080;

app.use(express.json());

app.get("/", (_, res) => {
  res.send(
    `Please post your image url to /imageUrl in the format: <br>${JSON.stringify({ imageUrl: "SOME_IMAGE_URL" })}`,
  );
});
app.post("/imageUrl", postImageUrlHandler);

app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
