import { Router } from "express";
import {
  uniqueNamesGenerator,
  adjectives,
  names,
} from "unique-names-generator";
import { Post } from "../models/Post.js";

const router = Router();

router.post("/", async (req, res) => {
  const newPost = new Post({
    name: uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      separator: " ",
      style: "capital",
    }),
    ...req.body,
  });

  await newPost.save((err) => {
    if (err) {
      res
        .status(500)
        .json({ status: "error", message: "Error saving post", data: null });
    } else {
      res
        .status(201)
        .json({ status: "success", message: "Post created", data: null });
    }
  });
});

router.get("/", (req, res) => {
  Post.find({ "meta.isDeleted": false }, { meta: 0 }, (err, posts) => {
    if (err) {
      res
        .status(500)
        .json({ status: "error", message: "Error fetching posts", data: null });
    } else {
      res.status(200).json({
        status: "success",
        message: "Posts fetched successfully",
        data: posts,
      });
    }
  });
});

router.get("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id }, (err, post) => {
    if (err) {
      res
        .status(500)
        .json({ status: "error", message: "Error fetching post", data: null });
    } else {
      const { meta, ...others } = post.toObject();

      res.status(200).json({
        status: "success",
        message: "Post fetched successfully",
        data: { ...others, meta: { isDeleted: meta.isDeleted } },
      });
    }
  });
});

export default router;
