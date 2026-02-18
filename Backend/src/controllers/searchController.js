import pool from "../config/db.js";

/* ============================
   SEARCH BUSES BY STOPS
============================ */

export const searchBusesByStops = async (req, res) => {
  const { sourceStopId, destinationStopId } = req.query;

  if (!sourceStopId || !destinationStopId) {
    return res.status(400).json({
      message: "sourceStopId and destinationStopId are required"
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT DISTINCT
        b.id,
        b.bus_number,
        b.route_id,
        r.route_name
      FROM route_stops rs_source
      JOIN route_stops rs_dest
        ON rs_source.route_id = rs_dest.route_id
      JOIN routes r
        ON r.id = rs_source.route_id
      JOIN buses b
        ON b.route_id = r.id
      WHERE rs_source.stop_id = $1
        AND rs_dest.stop_id = $2
        AND rs_source.stop_order < rs_dest.stop_order
      ORDER BY b.bus_number ASC
      `,
      [sourceStopId, destinationStopId]
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to search buses" });
  }
};
