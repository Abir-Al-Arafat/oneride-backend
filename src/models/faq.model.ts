import mongoose, { Schema } from "mongoose";

const faqModel = new Schema(
  {
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Faq", faqModel);
