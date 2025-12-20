import express from "express";
import CalendarNotice from "../models/CalendarNotice.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// add notice for a date
router.post("/notice", authMiddleware, async (req, res) => {
  try {
    const { teamId, date, title, message } = req.body;

    if (!teamId || !date || !title || !message) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const notice = await CalendarNotice.create({
      teamId,
      date,
      title,
      message,
      createdBy: req.user.id,
    });

    return res.json({
      success: true,
      message: "Notice saved",
      notice,
    });
  } catch (err) {
    console.log("Calendar notice save error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

// get notices for a date
router.get("/:teamId/:date", authMiddleware, async (req, res) => {
  try {
    const { teamId, date } = req.params;

    const notices = await CalendarNotice.find({
      teamId,
      date,
    }).populate("createdBy", "fullName");

    return res.json({
      success: true,
      notices,
    });
  } catch (err) {
    console.log("Calendar notice fetch error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

export default router;
