import express from "express";
import Notice from "../models/Notice.js";
import Team from "../models/Team.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create Notice (Admin only)
router.post("/:teamId", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { title, message } = req.body;

    if (!title || !message) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.json({ success: false, message: "Team not found" });

    const isAdmin = team.admin.toString() === req.user.id;
    if (!isAdmin) return res.json({ success: false, message: "Not allowed" });

    const notice = await Notice.create({
      team: teamId,
      title,
      message,
      createdBy: req.user.id
    });

    return res.json({ success: true, message: "Notice posted", notice });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Server error" });
  }
});

// Get Notices (Member + Admin)
router.get("/:teamId", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) return res.json({ success: false, message: "Team not found" });

    const isMember =
      team.members.map(String).includes(req.user.id) ||
      team.admin.toString() === req.user.id;

    if (!isMember)
      return res.json({ success: false, message: "Access denied" });

    const notices = await Notice.find({ team: teamId })
      .populate("createdBy", "fullName")
      .sort({ createdAt: -1 });

    return res.json({ success: true, notices });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Server error" });
  }
});

// Delete Notice (Admin only)
router.delete("/:noticeId", authMiddleware, async (req, res) => {
  try {
    const { noticeId } = req.params;

    const notice = await Notice.findById(noticeId);
    if (!notice) return res.json({ success: false, message: "Not found" });

    const team = await Team.findById(notice.team);
    const isAdmin = team.admin.toString() === req.user.id;

    if (!isAdmin)
      return res.json({ success: false, message: "Not allowed" });

    await notice.deleteOne();

    return res.json({ success: true, message: "Notice deleted" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Server error" });
  }
});

export default router;
