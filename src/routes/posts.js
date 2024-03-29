import { Router } from "express";
import mongoose from "mongoose";
import {
  uniqueNamesGenerator,
  adjectives,
  names,
} from "unique-names-generator";
import extract from "mention-hashtag";
import {
  createPostLimiter,
  getPostLimiter,
  getPostsLimiter,
} from "../middleware/rate-limit.js";
import { cache } from "../middleware/cache.js";
import Post from "../models/Post.js";
import Hashtag from "../models/Hashtag.js";

const router = Router();

router.post("/", createPostLimiter, async (req, res) => {
  let post;

  const session = await mongoose.startSession();
  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  try {
    const transaction = await session.withTransaction(async () => {
      const newPost = new Post({
        name: uniqueNamesGenerator({
          dictionaries: [adjectives, names],
          separator: " ",
          style: "capital",
        }),
        tag: extract(req.body.body, { type: "all", unique: true }),
        //! Don't do this, it's a security issue. Be more specific.
        ...req.body,
      });

      const savedPost = await newPost.save({ session });
      post = savedPost;

      await Hashtag.bulkWrite(
        newPost.tag.hashtags.map((tag) => {
          return {
            updateOne: {
              filter: { hashtag: tag },
              update: {
                $setOnInsert: { hashtag: tag },
                $inc: { "count.posts": 1 },
              },
              upsert: true,
            },
          };
        }),
        { session }
      );
    }, transactionOptions);

    if (transaction) {
      const { meta, ...others } = post._doc;

      res.status(201).json({
        status: "success",
        message: "Post created successfully",
        data: others,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Error saving post - Transaction failed",
        data: null,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Something went wrong - ${err.message}`,
      data: null,
    });
  } finally {
    await session.endSession();
  }
});

router.get("/", getPostsLimiter, cache(10, 86400), (req, res) => {
  const { sort = "createdAt" } = req.query;

  Post.find({ "meta.isDeleted": false }, { meta: 0, tag: 0 })
    .sort({ [sort]: -1 })
    .exec((err, posts) => {
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

router.get("/:id", getPostLimiter, cache(20, 86400), (req, res) => {
  Post.findOne({ _id: req.params.id }, (err, post) => {
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
