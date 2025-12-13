import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.json({ success: false, message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const verifyToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      verificationCode: otp,
      verificationToken: verifyToken,
      verificationExpires: Date.now() + 10 * 60 * 1000,
      isVerified: false,
    });

    const html = `
      <h3>Email Verification</h3>
      <p>Your OTP:</p>
      <h2>${otp}</h2>
    `;

    await sendEmail(email, "Verify your email", html);

    // auto login token
    const loginToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Signup successful",
      token: loginToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("Signup error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

// VERIFY OTP
// VERIFY OTP API
router.post("/verify-otp", async (req, res) => {
  try {
    const { otp } = req.body;

    const user = await User.findOne({ verificationCode: otp });

    if (!user) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verificationExpires < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpires = null;
    await user.save();

    // AUTO LOGIN TOKEN
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Server error" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Wrong password" });
    }

    if (!user.isVerified) {
      return res.json({ success: false, message: "Verify email first" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("Login error:", err);
    return res.json({ success: false, message: "Server error" });
  }
});

export default router;
