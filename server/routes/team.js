import express from "express";
import Team from "../models/Team.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* ---------------------------------------------
   CREATE TEAM
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

/* ---------------------------------------------
   JOIN TEAM (SEND REQUEST)
--------------------------------------------- */
router.post("/join", authMiddleware, async (req, res) => {
  try {
    const { teamCode } = req.body;

    const team = await Team.findOne({ teamCode });

    if (!team) {
      return res.json({ success: false, message: "Invalid team code" });
    }

    // already a member?
    if (team.members.map(String).includes(req.user.id)) {
      return res.json({
        success: false,
        message: "You are already a member of this team",
      });
    }

    // already requested?
    if (team.joinRequests.map(String).includes(req.user.id)) {
      return res.json({
        success: false,
        message: "You already sent a join request",
      });
    }

    team.joinRequests.push(req.user.id);
    await team.save();

    return res.json({
      success: true,
      message: "Join request sent successfully",
    });
  } catch (err) {
    console.log("Join Team Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   GET TEAMS WHERE I'M A MEMBER
--------------------------------------------- */
router.get("/my-teams", authMiddleware, async (req, res) => {
  try {
    const teams = await Team.find({
      members: req.user.id,
    }).select("teamName teamDesc teamCode createdAt admin");

    return res.json({
      success: true,
      teams,
    });
  } catch (err) {
    console.log("Fetch Teams Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   GET TEAMS WHERE I'M ADMIN (FOR ADMIN PAGE)
--------------------------------------------- */
router.get("/admin/teams", authMiddleware, async (req, res) => {
  try {
    const teams = await Team.find({
      admin: req.user.id,
    }).select("teamName teamDesc teamCode createdAt joinRequests members");

    return res.json({
      success: true,
      teams,
    });
  } catch (err) {
    console.log("Admin Teams Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   GET JOIN REQUESTS + MEMBERS FOR A TEAM
   (ADMIN → full, MEMBER → members only)
--------------------------------------------- */
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
    const isMember =
      team.members.map(String).includes(req.user.id) || isAdmin;

    if (!isMember) {
      return res.json({ success: false, message: "Not allowed" });
    }

    return res.json({
      success: true,
      teamName: team.teamName,
      members: team.members,
      joinRequests: isAdmin ? team.joinRequests : [],
      isAdmin,
    });
  } catch (err) {
    console.log("Get Requests Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   APPROVE JOIN REQUEST (ADMIN)
--------------------------------------------- */
router.post("/:teamId/approve", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    if (team.admin.toString() !== req.user.id) {
      return res.json({ success: false, message: "Not allowed" });
    }

    // remove from joinRequests
    team.joinRequests = team.joinRequests.filter(
      (id) => id.toString() !== userId
    );

    // add to members if not already
    if (!team.members.map(String).includes(userId)) {
      team.members.push(userId);
    }

    await team.save();

    return res.json({
      success: true,
      message: "Request approved and member added",
    });
  } catch (err) {
    console.log("Approve Request Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

/* ---------------------------------------------
   REJECT JOIN REQUEST (ADMIN)
--------------------------------------------- */
router.post("/:teamId/reject", authMiddleware, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.json({ success: false, message: "Team not found" });
    }

    if (team.admin.toString() !== req.user.id) {
      return res.json({ success: false, message: "Not allowed" });
    }

    team.joinRequests = team.joinRequests.filter(
      (id) => id.toString() !== userId
    );

    await team.save();

    return res.json({
      success: true,
      message: "Request rejected",
    });
  } catch (err) {
    console.log("Reject Request Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

export default router;
