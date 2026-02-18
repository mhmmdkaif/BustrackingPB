import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

export default router;
