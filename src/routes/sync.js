import { Router } from "express";
import { Post } from "../models/Post.js";

const router = Router();

router.post("/", (req, res) => {
  const { t, v } = req.query;
  const { ids } = req.body;

  if (ids && t === "post") {
    if (v === "likes") {
      Post.updateMany(
        { _id: { $in: ids } },
        { $inc: { "count.likes": 1 } },
        (err) => {
          if (err) {
            res.status(500).json({
              status: "error",
              message: "Error while syncing likes, please try again later",
            });
          } else {
            res
              .status(200)
              .json({ status: "success", message: "Likes synced" });
          }
        }
      );
    } else if (v === "unlikes") {
      Post.updateMany(
        { _id: { $in: ids } },
        { $inc: { "count.likes": -1 } },
        (err) => {
          if (err) {
            res.status(500).json({
              status: "error",
              message: "Error while syncing likes, please try again later",
            });
          } else {
            res
              .status(200)
              .json({ status: "success", message: "Likes synced" });
          }
        }
      );
    } else if (v === "dislikes") {
      Post.updateMany(
        { _id: { $in: ids } },
        { $inc: { "count.dislikes": 1 } },
        (err) => {
          if (err) {
            res.status(500).json({
              status: "error",
              message: "Error while syncing dislikes, please try again later",
            });
          } else {
            res
              .status(200)
              .json({ status: "success", message: "Dislikes synced" });
          }
        }
      );
    } else if (v === "undislikes") {
      Post.updateMany(
        { _id: { $in: ids } },
        { $inc: { "count.dislikes": -1 } },
        (err) => {
          if (err) {
            res.status(500).json({
              status: "error",
              message: "Error while syncing dislikes, please try again later",
            });
          } else {
            res
              .status(200)
              .json({ status: "success", message: "Dislikes synced" });
          }
        }
      );
    } else if (v === "reports") {
      Post.updateMany(
        { _id: { $in: ids } },
        { $inc: { "count.reports": 1 } },
        (err) => {
          if (err) {
            res.status(500).json({
              status: "error",
              message: "Error while syncing reports, please try again later",
            });
          } else {
            res
              .status(200)
              .json({ status: "success", message: "Reports synced" });
          }
        }
      );
    }
  } else {
    res.status(400).json({ status: "error", message: "Invalid request" });
  }
});

export default router;