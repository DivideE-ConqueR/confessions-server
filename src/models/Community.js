import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imgURL: String,
    bannerURL: String,
    address: {
      landmark: String,
      addressLine: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true,
      },
    },
    meta: {
      reports: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Reports cannot be negative"],
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

export default mongoose.model("Community", communitySchema);

// // Path: src\routes\community.js
// import express from "express";
// import Community from "../models/Community.js";
// import Post from "../models/Post.js";
// import User from "../models/User.js";

// const router = express.Router();

// // @route   GET api/community
// // @desc    Get all communities
// // @access  Public
// router.get("/", async (req, res) => {
//   try {
//     const communities = await Community.find();
//     res.json(communities);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });
