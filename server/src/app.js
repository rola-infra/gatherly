import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middleware/errorHandler.js";
import eventRoutes from "./routes/eventRoutes.js";

import { protect } from "./middleware/protect.js";

const app = express();
app.use(cookieParser());

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/api/me", protect, (req, res) => {
  res.json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.use(globalErrorHandler);

export default app;
