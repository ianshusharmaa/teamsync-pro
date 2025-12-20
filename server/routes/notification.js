import express from "express";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// get my notifications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const list = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    return res.json({ success: true, notifications: list });
  } catch (err) {
    return res.json({ success: false, message: "Server error" });
  }
});

// mark notification as read
router.post("/:id/read", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      isRead: true,
    });

    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, message: "Server error" });
  }
});

export default router;
