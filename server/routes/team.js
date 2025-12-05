import express from "express";
import Team from "../models/Team.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create New Team
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { teamName, teamDesc, teamCode } = req.body;

    if (!teamName || !teamCode) {
      return res.json({ success: false, message: "Missing fields" });
    }

    // Check if code already exists
    const exist = await Team.findOne({ teamCode });
    if (exist) {
      return res.json({ success: false, message: "Team code already exists" });
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
      message: "Team created successfully",
      team,
    });
  } catch (err) {
    console.log("Team Create Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

export default router;
