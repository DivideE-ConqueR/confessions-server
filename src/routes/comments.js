import { Router } from "express";
import {
  adjectives,
  names,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { Comment } from "../models/Comment.js";

const router = Router();

router.post("/", async (req, res) => {
  const newComment = new Comment({
    name: uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      separator: " ",
      style: "capital",
    }),
    ...req.body,
  });

  await newComment.save((err) => {
    if (err) {
      res
        .status(500)
        .json({ status: "error", message: "Error saving comment", data: null });
    } else {
      res
        .status(201)
        .json({ status: "success", message: "Comment created", data: null });
    }
  });
});

router.get("/:id", (req, res) => {
  Comment.find(
    { $and: [{ pid: req.params.id }, { "meta.isDeleted": false }] },
    { meta: 0 },
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
