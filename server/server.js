import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/team.js";
import noticeRoutes from "./routes/notice.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/notice", noticeRoutes);

// Default
app.get("/", (req, res) => {
  res.send("TeamSync Pro Backend Running");
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
