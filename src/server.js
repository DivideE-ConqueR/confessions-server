import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import posts from "./routes/posts.js";
import comments from "./routes/comments.js";
import sync from "./routes/sync.js";

dotenv.config({ debug: true });
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_URI, { dbName: "confessionsDB" }).then(
  () => {
    console.log("Connected to MongoDB");
  },
  (err) => {
    console.log(err);
  }
);

app.get("/", (_req, res) => {
  res.status(200).send("Hello Confessions API");
});

app.get("/api", (_req, res) => {
  res.redirect(303, "/");
});

app.use("/api/posts", posts);
app.use("/api/comments", comments);
app.use("/api/sync", sync);

app.all("*", (_req, res) => {
  res
    .status(404)
    .json({ status: "error", message: "404 - Not Found", data: null });
}); 

app.listen(process.env.PORT || 8000, () => {
  console.log("server started");
});
