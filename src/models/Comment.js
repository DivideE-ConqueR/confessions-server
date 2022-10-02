import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment: String,
    name: String,
    postId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
