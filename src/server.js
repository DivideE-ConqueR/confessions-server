import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import test from "./routes/test.js";

dotenv.config({ debug: true });
const app = express();
app.use(express.json());

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

app.use("/api/test", test);

app.listen(process.env.PORT || 3000, () => {
  console.log("server started");
});
