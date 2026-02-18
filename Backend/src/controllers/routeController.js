import pool from "../config/db.js";

/* ============================
   ADD ROUTE
============================ */

export const addRoute = async (req, res) => {

  // Admin only
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const route_name = req.body.route_name?.trim();
  const start_point = req.body.start_point?.trim();
  const end_point = req.body.end_point?.trim();

  if (!route_name || !start_point || !end_point) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO routes (route_name, start_point, end_point)
      VALUES ($1,$2,$3)
      RETURNING id,route_name,start_point,end_point
      `,
      [route_name, start_point, end_point]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err.message);

    if (err.code === "23505") {
      return res.status(409).json({ message: "Route already exists" });
    }

    res.status(500).json({ message: "Failed to add route" });
  }
};

/* ============================
   GET ROUTES
============================ */

export const getRoutes = async (req, res) => {

  try {
    const result = await pool.query(`
      SELECT id,route_name,start_point,end_point
      FROM routes
      ORDER BY route_name ASC
    `);

    res.status(200).json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch routes" });
  }
};
