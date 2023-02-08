import { Router } from "express";
import Post from "../models/Post.js";

const router = Router();

router.post("/", async (req, res) => {
  const { q } = req.query;

  const pipeline = [
    {
      $search: {
        text: {
          query: q,
          path: ["name", "body"],
          fuzzy: {
            maxEdits: 1,
          },
        },
      },
    },
    {
      $match: {
        "meta.isDeleted": false,
      },
    },
    {
      $project: {
        name: 1,
        body: 1,
        count: 1,
        engagement: 1,
        createdAt: 1,
        updatedAt: 1,
        score: {
          $meta: "searchScore",
        },
      },
    },
    {
      $limit: 30,
    },
  ];

  try {
    const result = await Post.aggregate(pipeline);
    res.status(200).json({
      status: "success",
      message: "Search results",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: `Error searching - ${err.message}`,
      data: null,
    });
  }
});

export default router;