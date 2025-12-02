import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// -------------------
// SIGNUP API
// -------------------
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check empty
    if (!fullName || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save user
    await User.create({
      fullName,
      email,
      password: hashed,
    });

    return res.json({ success: true, message: "Account created" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});

// -------------------
// LOGIN API
// -------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check empty
    if (!email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Match password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});

export default router;
