import express from "express";
import ChatMessage from "../models/ChatMessage.js";
import Team from "../models/Team.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// send message
router.post("/:teamId", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.json({ success: false, message: "Message cannot be empty" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    const isMember =
      team.members.map(String).includes(req.user.id) ||
      team.admin.toString() === req.user.id;

    if (!isMember) {
      return res.json({ success: false, message: "You are not in this team" });
    }

    const msg = await ChatMessage.create({
      team: teamId,
      sender: req.user.id,
      text: text.trim(),
    });

    return res.json({
      success: true,
      message: "Message sent",
      data: msg,
    });
  } catch (err) {
    console.log("Chat send error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

// get messages
router.get("/:teamId", authMiddleware, async (req, res) => {
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
      return res.json({ success: false, message: "You are not in this team" });
    }

    const messages = await ChatMessage.find({ team: teamId })
      .populate("sender", "fullName email")
      .sort({ createdAt: 1 })
      .limit(200);

    return res.json({
      success: true,
      messages,
    });
  } catch (err) {
    console.log("Chat fetch error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

export default router;
