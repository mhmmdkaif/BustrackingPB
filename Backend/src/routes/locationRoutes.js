import express from "express";
import { updateLocation, getBusLocation } from "../controllers/locationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, updateLocation);        // driver
router.get("/:id", protect, getBusLocation);     // user

export default router;
