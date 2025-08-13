import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    paymentIntentId: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "success",
    },
    amount: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
