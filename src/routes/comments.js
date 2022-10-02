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
    ...req.body,
    name: uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      separator: " ",
      style: "capital",
    }),
  });
  await newComment.save((err) => {
    if (err) {
      res.status(500).send("Error saving comment");
    } else {
      res.status(201).json("Comment created");
    }
  });
});

router.get("/:postId", (req, res) => {
  Comment.find({ postId: req.params.postId }, (err, comments) => {
    if (err) {
      res.status(500).send("Error fetching comments");
    } else {
      res.status(200).json(comments);
    }
  });
});

export default router;
