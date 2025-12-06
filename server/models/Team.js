import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
    },
    teamDesc: {
      type: String,
    },
    teamCode: {
      type: String,
      required: true,
      unique: true,
    },

    // Admin of the team
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Members list
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],

    // Users who requested to join the team
    joinRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);
