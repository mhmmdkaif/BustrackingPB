import express from "express";
import { searchBusesByStops } from "../controllers/searchController.js";

const router = express.Router();

// Public search
router.get("/search/buses", searchBusesByStops);

export default router;
