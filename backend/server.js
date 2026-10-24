
import express from "express";
import pool from "./db.js";
import "dotenv/config";
import auth_routes from "./routes/auth_routes.js";
import inquiryRoutes from "./routes/inquiry_routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/auth", auth_routes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Customer Inquiry API is running",
  });
});

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
    console.error("Database connection failed:", error);

    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
