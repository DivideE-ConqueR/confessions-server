import mongoose from "mongoose";
import {
  bodyValidation,
  ipValidation,
  uidValidation,
} from "../utils/validation.js";

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      validate: {
        validator: bodyValidation,
        message: (props) => `${props.value} is shorter than 3 characters`,
      },
      required: true,
    },
    tag: {
      hashtags: [String],
      mentions: [String],
    },
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
        validate: {
          validator: uidValidation,
          message: (props) => `${props.value} is not a valid uid`,
        },
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
        validate: {
          validator: ipValidation,
          message: (props) => `${props.value} is not a valid ip`,
        },
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
