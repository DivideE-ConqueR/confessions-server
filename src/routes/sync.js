import { Router } from "express";
import { syncLimiter } from "../middleware/rate-limit.js";
import Post from "../models/Post.js";

const router = Router();

router.post("/", syncLimiter, (req, res) => {
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
              data: null,
            });
          } else {
            res
              .status(200)
              .json({ status: "success", message: "Likes synced", data: null });
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
              data: null,
            });
          } else {
            res
              .status(200)
              .json({ status: "success", message: "Likes synced", data: null });
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
              data: null,
            });
          } else {
            res.status(200).json({
              status: "success",
              message: "Dislikes synced",
              data: null,
            });
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
              data: null,
            });
          } else {
            res.status(200).json({
              status: "success",
              message: "Dislikes synced",
              data: null,
            });
          }
        }
      );
    } else if (v === "reports") {
      Post.updateMany(
        { _id: { $in: ids } },
        { $inc: { "meta.reports": 1 } },
        (err) => {
          if (err) {
            res.status(500).json({
              status: "error",
              message: "Error while syncing reports, please try again later",
              data: null,
            });
          } else {
            res.status(200).json({
              status: "success",
              message: "Reports synced",
              data: null,
            });
          }
        }
      );
    }
  } else {
    res
      .status(400)
      .json({ status: "error", message: "Invalid request", data: null });
  }
});

export default router;
