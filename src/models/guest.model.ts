import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "please provide email"],
      unique: true,
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

    paymentIntent: {
      type: String,
    },

    roles: {
      type: [String],
      enum: ["user", "guest"],
      default: ["guest"],
    },

    bio: {
      type: String,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    passportIdentity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PassportIdentity",
    },

    licenceDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Licence",
    },

    balance: {
      type: Number,
      min: 0,
      default: 0,
    },

    dateOfBirth: {
      type: Date,
    },

    notifications: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Notification" },
    ],

    emailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifyCode: {
      type: Number,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    reviewGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    reviewReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

guestSchema.index({ currentLocation: "2dsphere" });

export default mongoose.model("Guest", guestSchema);
