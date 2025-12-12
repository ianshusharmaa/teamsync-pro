// server/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

// create jwt token - single-line comment
const makeToken = (user) => jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

// SIGNUP - creates user and returns token (auto-login)
// simple: returns token and user so frontend logs in immediately
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) return res.json({ success: false, message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    // generate OTP for optional verification (kept but not required for login)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      fullName,
      email,
      password: hashed,
      verificationCode: otp,
      isVerified: true, // set true to allow immediate login after signup
      verificationExpires: Date.now() + 10 * 60 * 1000,
    });

    // send verification email optionally (non-blocking)
    try {
      const verifyLink = `${process.env.CLIENT_URL}/verify-email/${jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" })}`;
      const html = `<p>Hello ${fullName},</p><p>Your verification code: <b>${otp}</b></p><p>Or click <a href="${verifyLink}">here</a></p>`;
      await sendEmail(email, "Verify your email - TeamSync Pro", html);
    } catch (e) {
      console.log("Send email failed (non-fatal):", e);
    }

    const token = makeToken(user);

    return res.json({
      success: true,
      message: "Signup successful, logged in",
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.log("Signup Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

// LOGIN - unchanged behaviour, requires verified if you want (kept as is)
// simple: returns token and user object
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ success: false, message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: "Incorrect password" });

    // if you want to force verify before login, uncomment next block
    // if (!user.isVerified) return res.json({ success: false, message: "Please verify your email before logging in." });

    const token = makeToken(user);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.log("Login Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

// VERIFY OTP - accept only otp (no email) and return token
// simple: frontend sends { otp: "123456" } and gets token if found
router.post("/verify-otp", async (req, res) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.json({ success: false, message: "OTP required" });

    const user = await User.findOne({ verificationCode: otp });
    if (!user) return res.json({ success: false, message: "Invalid OTP" });

    if (user.verificationExpires && user.verificationExpires < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpires = null;
    await user.save();

    const token = makeToken(user);

    return res.json({
      success: true,
      message: "Verified and logged in",
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.log("Verify OTP Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

// VERIFY LINK - keep as GET for clicking from email
// simple: mark user verified from link token
router.get("/verify-link/:token", async (req, res) => {
  try {
    const token = req.params.token;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.json({ success: false, message: "Invalid or expired link" });
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.json({ success: false, message: "User not found" });

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpires = null;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.log("Verify Link Error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

export default router;
