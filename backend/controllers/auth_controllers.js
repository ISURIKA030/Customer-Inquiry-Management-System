
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findStaffByEmail } from "../models/staff_model.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const staff = await findStaffByEmail(email.trim());

    if (!staff || !(await bcrypt.compare(password, staff.password_hash))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const token = jwt.sign(
      { id: staff.id.toString(), email: staff.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful.",
      token,
      staff: {
        id: staff.id.toString(),
        fullName: staff.full_name,
        email: staff.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Unable to log in at this time.",
    });
  }
}
