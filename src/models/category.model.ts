import mongoose, { Schema } from "mongoose";

const categoryModel = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categoryModel);
