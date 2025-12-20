import Notification from "../models/Notification.js";

// create notification helper
export const createNotification = async ({
  userId,
  teamId = null,
  type,
  message,
}) => {
  try {
    await Notification.create({
      user: userId,
      team: teamId,
      type,
      message,
    });
  } catch (err) {
    console.log("Notification create error:", err);
  }
};
