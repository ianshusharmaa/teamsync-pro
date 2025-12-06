import express from "express";
import Notice from "../models/Notice.js";
import Team from "../models/Team.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* ---------------------------------------------
   GET NOTICES FOR A TEAM (TEAM MEMBERS ONLY)
--------------------------------------------- */
router.get("/:teamId", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    // allow only members or admin to view notices
    const isMember =
      team.members.map(String).includes(req.user.id) ||
      team.admin.toString() === req.user.id;

    if (!isMember) {
      return res.json({ success: false, message: "Not allowed" });
    }

    const notices = await Notice.find({ team: teamId })
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      notices,
    });
  } catch (err) {
    console.log("Get Notices Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   CREATE NOTICE (ADMIN ONLY)
--------------------------------------------- */
router.post("/:teamId", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { title, message } = req.body;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    // only team admin can create notices
    if (team.admin.toString() !== req.user.id) {
      return res.json({ success: false, message: "Only admin can post notices" });
    }

    if (!title || !message) {
      return res.json({
        success: false,
        message: "Title and message are required",
      });
    }

    const notice = await Notice.create({
      team: teamId,
      title,
      message,
      createdBy: req.user.id,
    });

    return res.json({
      success: true,
      message: "Notice posted successfully",
      notice,
    });
  } catch (err) {
    console.log("Create Notice Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

export default router;
