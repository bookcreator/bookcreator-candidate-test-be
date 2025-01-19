import express from "express";
import "dotenv/config";
import { postImageUrlHandler } from "./handlers/postImageUrlHandler.js";
const app = express();
const port = parseInt(process.env.PORT) || 8080;

app.use(express.json());

app.post("/imageUrl", postImageUrlHandler);

app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
