import pool from "../config/db.js";

/* ============================
   ASSIGN DRIVER TO BUS
============================ */

export const assignDriver = async (req, res) => {

  // Admin only
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { driver_id, bus_id } = req.body;

  if (!driver_id || !bus_id) {
    return res.status(400).json({ message: "driver_id and bus_id required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check driver exists
    const driver = await client.query(
      "SELECT id FROM drivers WHERE id=$1",
      [driver_id]
    );

    if (driver.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Driver not found" });
    }

    // Check bus exists
    const bus = await client.query(
      "SELECT id, driver_id FROM buses WHERE id=$1",
      [bus_id]
    );

    if (bus.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Bus not found" });
    }

    // Prevent overwrite
    if (bus.rows[0].driver_id) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Bus already has a driver" });
    }

    // Assign
    await client.query(
      "UPDATE buses SET driver_id=$1 WHERE id=$2",
      [driver_id, bus_id]
    );

    await client.query("COMMIT");

    res.json({ message: "Driver assigned successfully" });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);
    res.status(500).json({ message: "Assignment failed" });
  } finally {
    client.release();
  }
};

/* ============================
   GET MY DRIVER PROFILE
============================ */

export const getMyDriverProfile = async (req, res) => {

  // Driver only
  if (req.user.role !== "driver") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const result = await pool.query(
      `
      SELECT 
        drivers.id,
        drivers.license_number,
        drivers.phone,
        users.name,
        users.email
      FROM drivers
      JOIN users ON drivers.user_id = users.id
      WHERE drivers.user_id=$1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Driver profile not found" });
    }

    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
