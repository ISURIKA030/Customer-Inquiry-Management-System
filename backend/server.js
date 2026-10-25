
import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./db.js";
import auth_routes from "./routes/auth_routes.js";
import inquiryRoutes from "./routes/inquiry_routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware must run before the routes
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// API routes
app.use("/api/auth", auth_routes);
app.use("/api/inquiries", inquiryRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Customer Inquiry API is running",
  });
});

// Database check
app.get("/api/db-check", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT current_database() AS database, NOW() AS time"
    );

    res.json({
      status: "OK",
      message: "PostgreSQL connected successfully",
      database: result.rows[0].database,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
