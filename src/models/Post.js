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
    commentsNumber: {
      type: Number,
      required: true,
      default: 0,
    },
    reports: {
      type: Number,
      required: true,
      default: 0,
    },
    postEngagement: {
      type: mongoose.Types.Decimal128,
      required: true,
      default: 0,
    },
    IPAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
