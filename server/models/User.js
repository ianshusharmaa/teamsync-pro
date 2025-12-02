import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Email verification fields
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationToken: { type: String },
    verificationExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
