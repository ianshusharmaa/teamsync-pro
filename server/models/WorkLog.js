import mongoose from "mongoose";

const workLogSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workText: {
      type: String,
      required: true,
    },
    date: {
      type: String, // yyyy-mm-dd
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("WorkLog", workLogSchema);
