import mongoose from "mongoose";

const partnershipSchema = new mongoose.Schema(
  {
    loggedInUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    organizerName: {
      type: String,
    },
    eventName: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    organizerEmail: {
      type: String,
    },
    eventDate: {
      type: Date,
    },
    eventLocation: {
      type: String,
    },
    transportationNeeds: {
      type: String,
    },
    adminNotes: {
      type: String,
    },
    image: {
      type: String,
    },

    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [0, 0],
      },
    },
    address: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

partnershipSchema.index({ currentLocation: "2dsphere" });

export default mongoose.model("Partnership", partnershipSchema);
