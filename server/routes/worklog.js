import express from "express";
import WorkLog from "../models/WorkLog.js";
import Team from "../models/Team.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* ---------------------------------------------
   SUBMIT WORK LOG (MEMBER ONLY)
--------------------------------------------- */
router.post("/:teamId", authMiddleware, async (req, res) => {
  try {
    const { workText } = req.body;
    const { teamId } = req.params;

    if (!workText) {
      return res.json({
        success: false,
        message: "Work description is required",
      });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    const isMember =
      team.members.map(String).includes(req.user.id) ||
      team.admin.toString() === req.user.id;

    if (!isMember) {
      return res.json({
        success: false,
        message: "You are not part of this team",
      });
    }

    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    // prevent duplicate logs same day
    const exists = await WorkLog.findOne({
      user: req.user.id,
      team: teamId,
      date: today,
    });

    if (exists) {
      return res.json({
        success: false,
        message: "You have already submitted today's work log",
      });
    }

    await WorkLog.create({
      team: teamId,
      user: req.user.id,
      workText,
      date: today,
    });

    return res.json({
      success: true,
      message: "Work log submitted successfully",
    });
  } catch (err) {
    console.log("Work Log Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   GET ALL LOGS (ADMIN ONLY)
--------------------------------------------- */
router.get("/:teamId/all", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    if (team.admin.toString() !== req.user.id) {
      return res.json({
        success: false,
        message: "Only admin can view all logs",
      });
    }

    const logs = await WorkLog.find({ team: teamId })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      logs,
    });
  } catch (err) {
    console.log("Get Logs Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   GET MY LOGS (MEMBER)
--------------------------------------------- */
router.get("/:teamId/my", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    const isMember =
      team.members.map(String).includes(req.user.id) ||
      team.admin.toString() === req.user.id;

    if (!isMember) {
      return res.json({
        success: false,
        message: "Not allowed",
      });
    }

    const logs = await WorkLog.find({
      team: teamId,
      user: req.user.id,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      logs,
    });
  } catch (err) {
    console.log("My Logs Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

export default router;
