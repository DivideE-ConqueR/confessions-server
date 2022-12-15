import { Router } from "express";
import {
  uniqueNamesGenerator,
  adjectives,
  names,
} from "unique-names-generator";
import { Post } from "../models/Post.js";
import { auth } from "../middlewares/auth.js";
import { cache } from "../middlewares/cache.js";

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
      res.status(500).json({
        status: "error",
        message: `Error saving post - ${err.message}`,
        data: null,
      });
    } else {
      res
        .status(201)
        .json({ status: "success", message: "Post created", data: null });
    }
  });
});

router.get("/", cache, (_req, res) => {
  Post.find({ "meta.isDeleted": false }, { meta: 0, tags: 0 }, (err, posts) => {
    if (err) {
      res.status(500).json({
        status: "error",
        message: `Error fetching posts - ${err.message}`,
        data: null,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Posts fetched successfully",
        data: posts,
      });
    }
  });
});

router.get("/:id", auth, (req, res) => {
  Post.findOne({ _id: req.params.id }, { tags: 0 }, (err, post) => {
    if (err) {
      res.status(500).json({
        status: "error",
        message: `Error fetching post - ${err.message}`,
        data: null,
      });
    } else {
      if (post) {
        const { meta, ...others } = post.toObject();

        res.status(200).json({
          status: "success",
          message: "Post fetched successfully",
          data: { ...others, meta: { isDeleted: meta.isDeleted } },
        });
      } else {
        res.status(404).json({
          status: "error",
          message: `Post not found`,
          data: null,
        });
      }
    }
  });
});

export default router;
