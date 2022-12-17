import { Router } from "express";
import mongoose from "mongoose";
import {
  adjectives,
  names,
  uniqueNamesGenerator,
} from "unique-names-generator";
import extract from "mention-hashtag";
import Comment from "../models/Comment.js";
import Hashtag from "../models/Hashtag.js";

const router = Router();

router.post("/", async (req, res) => {
  let comment;

  const session = await mongoose.startSession();
  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };

  try {
    const transaction = await session.withTransaction(async () => {
      const newComment = new Comment({
        name: uniqueNamesGenerator({
          dictionaries: [adjectives, names],
          separator: " ",
          style: "capital",
        }),
        tag: extract(req.body.body, { type: "all", unique: true }),
        //! Don't do this, it's a security issue. Be more specific.
        ...req.body,
      });

      const savedComment = await newComment.save({ session });
      comment = savedComment;

      await Hashtag.bulkWrite(
        newComment.tag.hashtags.map((tag) => {
          return {
            updateOne: {
              filter: { hashtag: tag },
              update: {
                $setOnInsert: { hashtag: tag },
                $inc: { "count.comments": 1 },
              },
              upsert: true,
            },
          };
        }),
        { session }
      );
    }, transactionOptions);

    if (transaction) {
      const { meta, ...others } = comment._doc;

      res.status(201).json({
        status: "success",
        message: "Comment created successfully",
        data: others,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Error saving comment - Transaction failed",
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

router.get("/:id", (req, res) => {
  Comment.find(
    { $and: [{ pid: req.params.id }, { "meta.isDeleted": false }] },
    { meta: 0, tag: 0 },
    (err, comments) => {
      if (err) {
        res.status(500).json({
          status: "error",
          message: "Error fetching comments",
          data: null,
        });
      } else {
        res.status(200).json({
          status: "success",
          message: "Comments fetched successfully",
          data: comments,
        });
      }
    }
  );
});

export default router;
