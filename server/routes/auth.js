import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";


const router = express.Router(); 


// signup API

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // user exists?
    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Email already registered" });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // generate verification link token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const user = await User.create({
      fullName,
      email,
      password: hashed,
      verificationCode: otp,
      verificationToken: token,
      verificationExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // send email
    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

    const html = `
      <h2>Verify Your Email</h2>
      <p>Hello ${fullName},</p>
      <p>Your verification code is:</p>
      <h3>${otp}</h3>
      <p>Or click the link below to verify:</p>
      <a href="${verifyLink}" target="_blank">Verify Email</a>
      <p>This code/link expires in 10 minutes.</p>
    `;

    await sendEmail(email, "Verify your email - TeamSync Pro", html);

    return res.json({
      success: true,
      message: "Account created. Verification email sent.",
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server error" });
  }
});


// -------------------
// VERIFY OTP API
// -------------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: true, message: "Already verified" });
    }

    if (user.verificationExpires < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    if (user.verificationCode !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationToken = null;
    user.verificationExpires = null;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Server error" });
  }
});
 

// -------------------
// VERIFY LINK API
// -------------------
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

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: true, message: "Already verified" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationToken = null;
    user.verificationExpires = null;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.log(err);
    return res.json({ success: false, message: "Server error" });
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

    if (!user.isVerified) {
  return res.json({
    success: false,
    message: "Please verify your email before logging in.",
  });
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
