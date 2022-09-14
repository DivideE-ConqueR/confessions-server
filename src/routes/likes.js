import { Router } from "express";
import { Post } from "../models/Post.js";

const router = Router();

router.post("/", (req, res) => {
  Post.updateOne({ postId: req.body.postId }, { $inc: { likes: 1 } }, (err) => {
    if (err) {
      res.status(500).send("Error updating post");
    } else {
      res.status(200).json("Post updated");
    }
  });
});

export default router;
