import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // notification kis user ke liye hai
    },

    title: {
      type: String,
      required: true, // short heading
    },

    message: {
      type: String,
      required: true, // full message text
    },

    type: {
      type: String,
      default: "info", // info | success | warning | error
    },

    isRead: {
      type: Boolean,
      default: false, // unread by default
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  }
);

export default mongoose.model("Notification", notificationSchema);
