import express from "express";
import { assignDriver } from "../controllers/driverController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { getMyDriverProfile } from "../controllers/driverController.js";

const router = express.Router();

router.post("/assign", protect, adminOnly, assignDriver);
router.get("/me", protect, getMyDriverProfile);

export default router;
