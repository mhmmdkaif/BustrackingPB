import pool from "../config/db.js";

export const addBus = async (req, res) => {

  // 1️⃣ Admin only
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const bus_number = req.body.bus_number?.trim();
  const route_id = req.body.route_id;

  // 2️⃣ Validate
  if (!bus_number) {
    return res.status(400).json({ message: "Bus number required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO buses (bus_number, route_id)
       VALUES ($1,$2)
       RETURNING id,bus_number,route_id`,
      [bus_number, route_id || null]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err.message);

    // Unique constraint
    if (err.code === "23505") {
      return res.status(409).json({ message: "Bus already exists" });
    }

    res.status(500).json({ message: "Failed to add bus" });
  }
};

export const getBuses = async (req, res) => {

  try {
    const result = await pool.query(`
      SELECT 
        buses.id,
        buses.bus_number,
        routes.route_name,
        buses.route_id,
        buses.driver_id
      FROM buses
      LEFT JOIN routes ON buses.route_id = routes.id
      ORDER BY buses.bus_number ASC
    `);

    res.status(200).json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch buses" });
  }
};
