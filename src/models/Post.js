import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tags: [String],
    count: {
      likes: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Likes cannot be negative"],
      },
      dislikes: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Dislikes cannot be negative"],
      },
      comments: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Comments cannot be negative"],
      },
      views: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Views cannot be negative"],
      },
    },
    engagement: {
      type: mongoose.Types.Decimal128,
      required: true,
      default: 0,
    },
    meta: {
      uid: {
        type: String,
        required: true,
      },
      reports: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Reports cannot be negative"],
      },
      ip: {
        type: String,
        required: true,
      },
      isDeleted: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
