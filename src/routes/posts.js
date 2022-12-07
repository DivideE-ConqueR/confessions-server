import mongoose from "mongoose";
import { Router } from "express";
import {
  uniqueNamesGenerator,
  adjectives,
  names,
} from "unique-names-generator";
import Post from "../models/Post.js";
import Hashtag from "../models/Hashtag.js";

const router = Router();

router.post("/", async (req, res) => {
  const session = await mongoose.startSession();
  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  try {
    const transactionResults = await session.withTransaction(async () => {
      const newPost = new Post({
        name: uniqueNamesGenerator({
          dictionaries: [adjectives, names],
          separator: " ",
          style: "capital",
        }),
        ...req.body,
      });

      const postsCreateResults = await newPost.save({ session });

      await Hashtag.bulkWrite(
        req.body.tags.map((tag) => {
          return {
            updateOne: {
              filter: { hashtag: tag },
              update: {
                $setOnInsert: { hashtag: tag },
                $push: { posts: postsCreateResults._id },
              },
              upsert: true,
            },
          };
        }),
        { session }
      );
    }, transactionOptions);

    if (transactionResults) {
      res.status(201).json({
        status: "success",
        message: "Post created successfully",
        data: null,
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

router.get("/", (_req, res) => {
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

router.get("/:id", (req, res) => {
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
