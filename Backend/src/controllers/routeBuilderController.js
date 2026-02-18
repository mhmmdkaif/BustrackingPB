import pool from "../config/db.js";

/* ======================================================
   CREATE ROUTE WITH STOPS (ROUTEBUILDER)
====================================================== */

export const createRouteWithStops = async (req, res) => {

  // Admin only
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const route_name = req.body.route_name?.trim();
  const stops = req.body.stops;

  // Basic validation
  if (!route_name || !Array.isArray(stops) || stops.length < 2) {
    return res.status(400).json({
      message: "route_name and minimum 2 stops required"
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Fetch first & last stop names
    const firstStop = await client.query(
      "SELECT stop_name FROM stops WHERE id=$1",
      [stops[0]]
    );

    const lastStop = await client.query(
      "SELECT stop_name FROM stops WHERE id=$1",
      [stops[stops.length - 1]]
    );

    if (firstStop.rows.length === 0 || lastStop.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Invalid stop id found"
      });
    }

    const start_point = firstStop.rows[0].stop_name;
    const end_point = lastStop.rows[0].stop_name;

    // 2️⃣ Insert route
    const routeResult = await client.query(
      `
      INSERT INTO routes (route_name, start_point, end_point)
      VALUES ($1,$2,$3)
      RETURNING id
      `,
      [route_name, start_point, end_point]
    );

    const route_id = routeResult.rows[0].id;

    // 3️⃣ Insert route stops with order
    for (let i = 0; i < stops.length; i++) {
      await client.query(
        `
        INSERT INTO route_stops (route_id, stop_id, stop_order)
        VALUES ($1,$2,$3)
        `,
        [route_id, stops[i], i + 1]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Route created successfully",
      route_id
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);

    if (err.code === "23505") {
      return res.status(409).json({
        message: "Route name already exists"
      });
    }

    res.status(500).json({
      message: "Failed to create route"
    });

  } finally {
    client.release();
  }
};
