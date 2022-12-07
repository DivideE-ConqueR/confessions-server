import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    pid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
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
      replies: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Replies cannot be negative"],
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

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
