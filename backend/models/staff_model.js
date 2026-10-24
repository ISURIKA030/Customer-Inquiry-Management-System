
import pool from "../db.js";

export async function findStaffByEmail(email) {
  const result = await pool.query(
    `SELECT id, full_name, email, password_hash
     FROM staff_users
     WHERE email = $1`,
    [email]
  );

  return result.rows[0] || null;
}
