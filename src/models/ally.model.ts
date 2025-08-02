import mongoose, { Schema } from "mongoose";

const allyModel = new Schema(
  {
    name: {
      type: String,
    },
    location: {
      type: String,
    },
    websiteURL: {
      type: String,
    },
    type: {
      type: String,
      enum: ["pub", "restaurant", "venue"],
    },
    marketingBlurb: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ally", allyModel);
