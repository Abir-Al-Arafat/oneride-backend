import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
});

const transportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["busRoute", "parkAndRide", "pubPickup"],
      required: true,
    },
    pickUpPoint: {
      type: locationSchema,
      required: true,
    },
    dropOffPoint: {
      type: locationSchema,
      required: true,
    },
    duration: {
      type: String, // e.g., "45 mins"
      required: true,
    },
    departureTime: {
      type: String, // or Date if needed
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transport", transportSchema);
