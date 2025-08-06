import mongoose, { Schema } from "mongoose";

const bookingModel = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    transport: {
      type: Schema.Types.ObjectId,
      ref: "Transport",
      required: true,
    },
    ticketCount: {
      type: Number,
      required: true,
      min: 1,
    },
    registeredUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    guestUser: {
      type: Schema.Types.ObjectId,
      ref: "Guest",
    },
    paid: {
      type: Boolean,
      default: false,
    },
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingModel);
