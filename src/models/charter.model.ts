import mongoose, { Schema } from "mongoose";

const charterModel = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    passengerCount: {
      type: Number,
    },
    pickupLocation: {
      type: String,
    },
    dropoffLocation: {
      type: String,
    },
    pickupDateAndTime: {
      type: Date,
    },
    purpose: {
      type: String,
    },
    specialInstructions: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Charter", charterModel);
