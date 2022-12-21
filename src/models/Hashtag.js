import mongoose from "mongoose";

const hashtagSchema = new mongoose.Schema(
  {
    hashtag: String,
    count: {
      posts: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Posts cannot be negative"],
      },
      comments: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Comments cannot be negative"],
      },
    },
  },
  { timestamps: true }
);

const Hashtag = mongoose.model("Hashtag", hashtagSchema);

export default Hashtag;
