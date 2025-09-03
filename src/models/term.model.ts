import mongoose, { Schema } from "mongoose";

const termModel = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Term", termModel);
