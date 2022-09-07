import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());


mongoose.connect(`mongodb+srv://dev-admin:${process.env.MONGO_PASSWORD}@dev-cluster.d0zasl2.mongodb.net/?retryWrites=true&w=majority`);

let arr = [];
app.get("/", (req, res) => {
  res.send("Hello Confession!");
});

app.post("/new", (req, res) => {
  arr.push(req.body);
  res.send(arr);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server started");
});
