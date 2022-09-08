import { Router } from "express";
import { nanoid } from "nanoid";
import {
  uniqueNamesGenerator,
  adjectives,
  names,
} from "unique-names-generator";
import { Post } from "../models/Post.js";

const router = Router();

router.post("/", async (req, res) => {
  const newPost = new Post({
    postId: nanoid(),
    name: uniqueNamesGenerator({
      dictionaries: [adjectives, names],
      separator: " ",
      style: "capital",
    }),
    ...req.body,
  });
  await newPost.save((err) => {
    if (err) {
      res.status(500).send("Error saving post");
    } else {
      res.status(201).json("Post created");
    }
  });
});

export default router;
