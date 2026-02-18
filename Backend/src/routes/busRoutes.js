import express from "express";
import { addBus, getBuses } from "../controllers/busController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, addBus);
router.get("/", protect, getBuses);

export default router;
