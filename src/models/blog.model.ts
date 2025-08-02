import mongoose, { Schema } from "mongoose";

const blogModel = new Schema(
  {
    title: {
      type: String,
    },
    author: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogModel);
