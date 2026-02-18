import express from "express";
import {
  addStopToRoute,
  getRouteStops,
  addMultipleStopsToRoute
} from "../controllers/routeStopController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Legacy endpoints (if used elsewhere)
router.post("/route-stops", protect, addStopToRoute);
router.get("/route-stops/:routeId", protect, getRouteStops);

// Route Builder endpoints used by frontend admin UI
// GET ordered stops for a route
router.get("/routes/:routeId/stops", protect, getRouteStops);

// Overwrite full stop timeline for a route
router.post("/routes/:id/stops", protect, addMultipleStopsToRoute);

export default router;
