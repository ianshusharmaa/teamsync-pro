import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);
