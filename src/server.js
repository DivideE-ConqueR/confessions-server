import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import posts from "./routes/posts.js";
import likes from "./routes/likes.js";
import dislikes from "./routes/dislikes.js";

dotenv.config({ debug: true });
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_URI, { dbName: "confessions" }).then(
  () => {
    console.log("Connected to MongoDB");
  },
  (err) => {
    console.log(err);
  }
);

app.get("/", (req, res) => {
  res.status(200).send("Hello Confessions API");
});

app.use("/api/posts", posts);
app.use("/api/likes", likes);
app.use("/api/dislikes", dislikes);

app.listen(process.env.PORT || 8000, () => {
  console.log("server started");
});
