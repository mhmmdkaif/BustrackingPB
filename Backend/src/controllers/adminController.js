import pool from "../config/db.js";
import bcrypt from "bcryptjs";

export const createDriver = async (req, res) => {

  // 1️⃣ Admin only
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  // 2️⃣ Sanitize & extract
  const name = req.body.name?.trim();
  const email = req.body.email?.trim();
  const password = req.body.password;
  const license_number = req.body.license_number?.trim();
  const phone = req.body.phone?.trim();

  // 3️⃣ Validate
  if (!name || !email || !password || !license_number || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 4️⃣ Email check
    const exists = await client.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (exists.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({ message: "Email already exists" });
    }

    // 5️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 6️⃣ Create user
    const newUser = await client.query(
      `INSERT INTO users(name,email,password,role)
       VALUES($1,$2,$3,'driver')
       RETURNING id`,
      [name, email, hashedPassword]
    );

    // 7️⃣ Create driver profile
    await client.query(
      `INSERT INTO drivers(user_id, license_number, phone)
       VALUES($1,$2,$3)`,
      [newUser.rows[0].id, license_number, phone]
    );

    await client.query("COMMIT");

    res.status(201).json({ message: "Driver created successfully" });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err.message);

    // Unique constraint safety
    if (err.code === "23505") {
      return res.status(409).json({ message: "Duplicate entry detected" });
    }

    res.status(500).json({ message: "Failed to create driver" });

  } finally {
    client.release();
  }
};

export const getDrivers = async (req, res) => {

  // Admin only
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const result = await pool.query(`
      SELECT 
        drivers.id,
        users.name,
        users.email,
        drivers.license_number,
        drivers.phone
      FROM drivers
      JOIN users ON drivers.user_id = users.id
      WHERE users.role = 'driver'
      ORDER BY users.name ASC
    `);

    res.status(200).json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch drivers" });
  }
};
