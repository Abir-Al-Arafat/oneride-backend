import mongoose, { Schema } from "mongoose";

const invitationModel = new Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "eventOrganizer", "viewer"],
      default: "viewer",
    },
    optionalMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invitation", invitationModel);
