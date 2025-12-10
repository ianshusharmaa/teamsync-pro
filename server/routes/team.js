import express from "express";
import Team from "../models/Team.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET MY TEAMS  (TeamDetails.jsx uses this)
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const teams = await Team.find({
      members: req.user.id,
    }).select("teamName teamDesc teamCode createdAt");

    return res.json({
      success: true,
      teams,
    });
  } catch (err) {
    console.log("My Teams Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

// CREATE TEAM
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { teamName, teamDesc, teamCode } = req.body;

    if (!teamName || !teamCode) {
      return res.json({ success: false, message: "Missing fields" });
    }

    const exists = await Team.findOne({ teamCode });
    if (exists) {
      return res.json({
        success: false,
        message: "Team code already exists",
      });
    }

    const team = new Team({
      teamName,
      teamDesc,
      teamCode,
      admin: req.user.id,
      members: [req.user.id],
    });

    await team.save();

    return res.json({
      success: true,
      team,
    });
  } catch (err) {
    console.log("Team Create Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

// GET TEAM DETAILS (required for TeamDetails.jsx)
router.get("/:teamId", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId)
      .populate("members", "fullName email")
      .populate("admin", "fullName email");

    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    return res.json({
      success: true,
      team,
    });
  } catch (err) {
    console.log("Team Detail Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

// GET JOIN REQUESTS
router.get("/:teamId/requests", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId)
      .populate("joinRequests", "fullName email")
      .populate("members", "fullName email");

    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    const isAdmin = team.admin.toString() === req.user.id;

    return res.json({
      success: true,
      requests: isAdmin ? team.joinRequests : [],
    });
  } catch (err) {
    console.log("Get Requests Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

export default router;
