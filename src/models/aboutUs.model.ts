import mongoose, { Schema } from "mongoose";

const about = new Schema(
  {
    headerText: {
      type: String,
    },

    subText: {
      type: String,
    },

    heroImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("About", about);
