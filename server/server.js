import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/team.js";
import noticeRoutes from "./routes/notice.js";
import workLogRoutes from "./routes/worklog.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/worklog", workLogRoutes);
app.use("/api/chat", chatRoutes);

// default
app.get("/", (req, res) => {
  res.send("TeamSync Pro Backend Running");
});

// mongodb
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
