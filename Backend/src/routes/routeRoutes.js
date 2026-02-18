import express from "express";
import { addRoute, getRoutes } from "../controllers/routeController.js";
import { createRouteWithStops } from "../controllers/routeBuilderController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Existing routes
router.post("/", protect, adminOnly, addRoute);
router.get("/", protect, getRoutes);

// 🔥 RouteBuilder route (NEW)
router.post("/full", protect, adminOnly, createRouteWithStops);

export default router;
