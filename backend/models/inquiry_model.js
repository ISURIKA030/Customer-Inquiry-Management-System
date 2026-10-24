
import pool from "../db.js";

export async function createInquiry(data, staffId) {
  const {
    customer_name,
    contact_details,
    contact_method,
    subject,
    description,
  } = data;

  const result = await pool.query(
    `INSERT INTO inquiries
      (customer_name, contact_details, contact_method,
       subject, description, created_by)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      customer_name,
      contact_details,
      contact_method,
      subject,
      description,
      staffId,
    ]
  );

  return result.rows[0];
}

export async function getAllInquiries(filters = {}) {
  const { search = "", status = "" } = filters;

  const conditions = [];
  const values = [];

  if (search.trim()) {
    values.push(`%${search.trim()}%`);
    conditions.push(
      `(customer_name ILIKE $${values.length}
        OR subject ILIKE $${values.length}
        OR contact_details ILIKE $${values.length})`
    );
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const result = await pool.query(
    `SELECT i.*, s.full_name AS created_by_name
     FROM inquiries i
     JOIN staff_users s ON s.id = i.created_by
     ${whereClause}
     ORDER BY i.created_at DESC`,
    values
  );

  


  return result.rows;
}


export async function updateInquiryStatus(id, status) {
  const result = await pool.query(
    `UPDATE inquiries
     SET status = $1,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

  return result.rows[0] || null;
}
