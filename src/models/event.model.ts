// models/Event.ts
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    description: { type: String },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    venueName: { type: String, required: true },

    busRoutes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transport" }],
    parkAndRides: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transport" }],
    pubPickups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transport" }],

    totalSeat: { type: Number, required: true },
    ticketPrice: { type: Number, required: true },

    image: { type: String }, // URL or path

    adminStatus: {
      type: String,
      enum: ["active", "draft", "ended"],
      default: "active",
    },

    websiteStatus: {
      type: String,
      enum: ["upcoming", "featured"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
