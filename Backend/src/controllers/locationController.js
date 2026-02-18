import pool from "../config/db.js";
import { haversine } from "../utils/eta.js";

/* ============================
   UPDATE BUS LOCATION
============================ */

export const updateLocation = async (req, res) => {

  // Driver only
  if (req.user.role !== "driver") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { bus_id, latitude, longitude, speed } = req.body;

  if (!bus_id || latitude == null || longitude == null) {
    return res.status(400).json({ message: "Invalid location data" });
  }

  try {

    // Ensure bus exists
    const bus = await pool.query(
      "SELECT id FROM buses WHERE id=$1",
      [bus_id]
    );

    if (bus.rows.length === 0) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const result = await pool.query(
      `
      INSERT INTO live_locations (bus_id, latitude, longitude, speed)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (bus_id)
      DO UPDATE SET
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        speed = EXCLUDED.speed,
        updated_at = NOW()
      RETURNING *
      `,
      [bus_id, latitude, longitude, speed || 0]
    );

    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to update location" });
  }
};

/* ============================
   GET BUS LOCATION + ETA
============================ */

export const getBusLocation = async (req, res) => {

  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM live_locations
      WHERE bus_id=$1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No location yet" });
    }

    const loc = result.rows[0];

    // Temporary destination
    const stopLat = 31.3260;
    const stopLon = 75.5762;

    const distance = haversine(
      loc.latitude,
      loc.longitude,
      stopLat,
      stopLon
    );

    let etaMinutes = null;

    if (loc.speed > 0) {
      const etaHours = distance / loc.speed;
      etaMinutes = Math.round(etaHours * 60);
    }

    res.status(200).json({
      bus_id: loc.bus_id,
      latitude: loc.latitude,
      longitude: loc.longitude,
      speed: loc.speed,
      updated_at: loc.updated_at,
      eta_minutes: etaMinutes
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch location" });
  }
};
