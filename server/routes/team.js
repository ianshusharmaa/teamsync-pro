// server/routes/team.js
import express from "express";
import Team from "../models/Team.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* ---------------------------------------------
   CREATE TEAM  (Invite Token Added)
--------------------------------------------- */
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

    // unique invite token
    const inviteToken = Math.random().toString(36).substring(2, 12);

    const team = new Team({
      teamName,
      teamDesc,
      teamCode,
      inviteToken, // 👈 new field
      admin: req.user.id,
      members: [req.user.id],
    });

    await team.save();

    return res.json({
      success: true,
      message: "Team created successfully",
      team,
      inviteLink: `${process.env.CLIENT_URL}/invite/${inviteToken}`,
    });
  } catch (err) {
    console.log("Create Team Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   MY TEAMS
--------------------------------------------- */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const teams = await Team.find({
      members: req.user.id,
    }).select("teamName teamDesc teamCode createdAt admin");

    return res.json({ success: true, teams });
  } catch (err) {
    console.log("Fetch My Teams Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   ADMIN TEAMS
--------------------------------------------- */
router.get("/admin/teams", authMiddleware, async (req, res) => {
  try {
    const teams = await Team.find({
      admin: req.user.id,
    }).select("teamName teamDesc teamCode createdAt joinRequests members");

    return res.json({ success: true, teams });
  } catch (err) {
    console.log("Fetch Admin Teams Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   TEAM DETAILS
--------------------------------------------- */
router.get("/:teamId", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId)
      .populate("members", "fullName email")
      .populate("admin", "fullName email");

    if (!team) return res.json({ success: false, message: "Team not found" });

    return res.json({ success: true, team });
  } catch (err) {
    console.log("Team Detail Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   JOIN REQUESTS
--------------------------------------------- */
router.get("/:teamId/requests", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findById(teamId)
      .populate("members", "fullName email")
      .populate("joinRequests", "fullName email");

    if (!team) return res.json({ success: false, message: "Team not found" });

    const isAdmin = team.admin.toString() === req.user.id;
    const isMember = team.members.map(String).includes(req.user.id) || isAdmin;

    if (!isMember) {
      return res.json({ success: false, message: "Not allowed" });
    }

    return res.json({
      success: true,
      members: team.members,
      requests: isAdmin ? team.joinRequests : [],
      isAdmin,
      teamName: team.teamName,
    });
  } catch (err) {
    console.log("Get Requests Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   APPROVE JOIN REQUEST
--------------------------------------------- */
router.post("/:teamId/approve", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "Missing userId" });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.json({ success: false, message: "Team not found" });

    if (team.admin.toString() !== req.user.id) {
      return res.json({ success: false, message: "Not allowed" });
    }

    team.joinRequests = team.joinRequests.filter(
      (id) => id.toString() !== userId
    );

    if (!team.members.map(String).includes(userId)) {
      team.members.push(userId);
    }

    await team.save();

    const updated = await Team.findById(teamId)
      .populate("members", "fullName email")
      .populate("joinRequests", "fullName email");

    return res.json({
      success: true,
      message: "Request approved",
      members: updated.members,
      requests: updated.joinRequests,
    });
  } catch (err) {
    console.log("Approve Request Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   REJECT JOIN REQUEST
--------------------------------------------- */
router.post("/:teamId/reject", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "Missing userId" });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.json({ success: false, message: "Team not found" });

    if (team.admin.toString() !== req.user.id) {
      return res.json({ success: false, message: "Not allowed" });
    }

    team.joinRequests = team.joinRequests.filter(
      (id) => id.toString() !== userId
    );

    await team.save();

    const updated = await Team.findById(teamId).populate(
      "joinRequests",
      "fullName email"
    );

    return res.json({
      success: true,
      message: "Request rejected",
      requests: updated.joinRequests,
    });
  } catch (err) {
    console.log("Reject Request Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
}); 
// AUTO JOIN TEAM using invite link
router.post("/join/invite", authMiddleware, async (req, res) => {
  try {
    const { inviteToken } = req.body; // get token from frontend

    // find team by invite token
    const team = await Team.findOne({ inviteToken });

    if (!team) return res.json({ success: false, message: "Invalid link" });

    // already member check
    if (team.members.map(String).includes(req.user.id)) {
      return res.json({ success: false, message: "Already a member" });
    }

    // add user directly to team
    team.members.push(req.user.id);
    await team.save();

    return res.json({
      success: true,
      message: "Joined team successfully",
      teamId: team._id
    });

  } catch (err) {
    console.log("Invite Join Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});


export default router;
