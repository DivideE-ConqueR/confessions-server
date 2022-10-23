import { Router } from "express";
import { Post } from "../models/Post.js";

const router = Router();

router.post("/", (req, res) => {
  Post.updateMany(
    { postId: { $in: req.body.ids } },
    { $inc: { likes: 1 } },
    (err) => {
      if (err) {
        res
          .status(500)
          .send(
            "Error while syncing likes, please try again later or contact support"
          );
      } else {
        res.status(200).json("Likes synced");
      }
    }
  );
});

export default router;
