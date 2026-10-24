
import "dotenv/config";
import bcrypt from "bcrypt";
import pool from "./db.js";

const email = "staff@coffeeninja.com";
const password = "Staff1234";
const fullName = "Demo Staff";

async function seedStaff() {
  try {
    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      `INSERT INTO staff_users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [fullName, email, passwordHash]
    );

    console.log("Demo staff account is ready.");
    console.log("Email:", email);
    console.log("Password:", password);
  } catch (error) {
    console.error("Could not create demo staff account:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedStaff();
