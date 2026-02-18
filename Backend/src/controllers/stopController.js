import pool from "../config/db.js";

/* ============================
   ADD STOP
============================ */

export const addStop = async (req, res) => {

  // Admin only
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const stop_name = req.body.stop_name?.trim();
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  if (!stop_name || latitude == null || longitude == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO stops (stop_name, latitude, longitude)
      VALUES ($1,$2,$3)
      RETURNING id,stop_name,latitude,longitude
      `,
      [stop_name, latitude, longitude]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err.message);

    if (err.code === "23505") {
      return res.status(409).json({ message: "Stop already exists" });
    }

    res.status(500).json({ message: "Failed to add stop" });
  }
};

/* ============================
   GET STOPS
============================ */

export const getStops = async (req, res) => {

  try {
    const result = await pool.query(`
      SELECT id,stop_name,latitude,longitude
      FROM stops
      ORDER BY stop_name ASC
    `);

    res.status(200).json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch stops" });
  }
};
