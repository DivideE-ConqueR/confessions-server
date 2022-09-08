import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    postBody: {
      type: String,
      required: true,
    },
    postTags: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      required: true,
    },
    likes: {
      type: Number,
      required: true,
      default: 0,
    },
    dislikes: {
      type: Number,
      required: true,
      default: 0,
    },
    reports: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
