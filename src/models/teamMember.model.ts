import mongoose, { Schema } from "mongoose";

const teamMemberModel = new Schema(
  {
    name: {
      type: String,
    },
    role: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TeamMember", teamMemberModel);
