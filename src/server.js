import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

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

let arr = [];

app.get("/", (req, res) => {
  res.send("Hello Confessions API");
});

app.post("/new", (req, res) => {
  arr.push(req.body);
  res.send(arr);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server started");
});
