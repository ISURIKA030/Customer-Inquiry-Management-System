
import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  createInquiryHandler,
  listInquiriesHandler,
} from "../controllers/inquiry_controllers.js";

const router = Router();

router.use(authenticateToken);

router.get("/", listInquiriesHandler);
router.post("/", createInquiryHandler);

export default router;
