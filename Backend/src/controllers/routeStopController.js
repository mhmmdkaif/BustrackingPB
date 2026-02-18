import pool from "../config/db.js";

/* ======================================================
   ADD SINGLE STOP TO ROUTE (OPTIONAL / MANUAL USE)
====================================================== */

export const addStopToRoute = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { route_id, stop_id, stop_order } = req.body;

  if (!route_id || !stop_id || !stop_order) {
    return res.status(400).json({
      message: "route_id, stop_id, stop_order are required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const route = await client.query(
      "SELECT id FROM routes WHERE id=$1",
      [route_id]
    );

    if (route.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Route not found" });
    }

    const stop = await client.query(
      "SELECT id FROM stops WHERE id=$1",
      [stop_id]
    );

    if (stop.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Stop not found" });
    }

    const result = await client.query(
      `
      INSERT INTO route_stops (route_id, stop_id, stop_order)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [route_id, stop_id, stop_order]
    );

    await client.query("COMMIT");

    res.status(201).json(result.rows[0]);

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);

    if (err.code === "23505") {
      return res.status(409).json({
        message: "Stop already exists or order already used",
      });
    }

    res.status(500).json({
      message: "Failed to add stop to route",
    });

  } finally {
    client.release();
  }
};

/* ======================================================
   SAVE ROUTE STOPS (OVERWRITE FULL TIMELINE)
====================================================== */

export const addMultipleStopsToRoute = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { id } = req.params;   // route id
  const { stops } = req.body; // [{ stop_id, stop_order }]

  if (!Array.isArray(stops)) {
    return res.status(400).json({
      message: "Stops must be an array",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const route = await client.query(
      "SELECT id FROM routes WHERE id=$1",
      [id]
    );

    if (route.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Route not found" });
    }

    // 🔥 Clear existing timeline
    await client.query(
      "DELETE FROM route_stops WHERE route_id=$1",
      [id]
    );

    // 🔥 Insert new timeline
    for (const stop of stops) {
      await client.query(
        `
        INSERT INTO route_stops (route_id, stop_id, stop_order)
        VALUES ($1,$2,$3)
        `,
        [id, stop.stop_id, stop.stop_order]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Route stops saved successfully",
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);

    res.status(500).json({
      message: "Failed to save route stops",
    });

  } finally {
    client.release();
  }
};

/* ======================================================
   GET STOPS FOR ROUTE (ORDERED)
====================================================== */

export const getRouteStops = async (req, res) => {
  const { routeId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        rs.stop_order,
        s.id,
        s.stop_name,
        s.latitude,
        s.longitude
      FROM route_stops rs
      JOIN stops s ON rs.stop_id = s.id
      WHERE rs.route_id = $1
      ORDER BY rs.stop_order ASC
      `,
      [routeId]
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Failed to fetch route stops",
    });
  }
};
