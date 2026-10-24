
import {
  createInquiry,
  getAllInquiries,
} from "../models/inquiry_models.js";

const allowedContactMethods = [
  "Telephone",
  "WhatsApp",
  "Email",
  "In person",
  "Other",
];

const allowedStatuses = ["New", "In Progress", "Resolved"];

export async function createInquiryHandler(req, res) {
  try {
    const {
      customer_name,
      contact_details,
      contact_method,
      subject,
      description,
    } = req.body;

    if (
      typeof customer_name !== "string" ||
      !customer_name.trim() ||
      typeof contact_details !== "string" ||
      !contact_details.trim() ||
      !allowedContactMethods.includes(contact_method) ||
      typeof subject !== "string" ||
      !subject.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        message: "Please provide all required fields with valid values.",
      });
    }

    const inquiry = await createInquiry(
      {
        customer_name: customer_name.trim(),
        contact_details: contact_details.trim(),
        contact_method,
        subject: subject.trim(),
        description: description.trim(),
      },
      req.staff.id
    );

    return res.status(201).json({
      message: "Inquiry created successfully.",
      inquiry,
    });
  } catch (error) {
    console.error("Create inquiry error:", error.message);
    return res.status(500).json({
      message: "Unable to create inquiry.",
    });
  }
}

export async function listInquiriesHandler(req, res) {
  try {
    const { search = "", status = "" } = req.query;

    if (typeof search !== "string" || typeof status !== "string") {
      return res.status(400).json({
        message: "Invalid search or status filter.",
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid inquiry status.",
      });
    }

    const inquiries = await getAllInquiries({ search, status });

    return res.json({ inquiries });
  } catch (error) {
    console.error("List inquiries error:", error.message);
    return res.status(500).json({
      message: "Unable to retrieve inquiries.",
    });
  }
}
