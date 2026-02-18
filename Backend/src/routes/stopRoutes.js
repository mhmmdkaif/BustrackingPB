import express from "express";
import { addStop, getStops } from "../controllers/stopController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, addStop);
router.get("/", protect, getStops);

export default router;
