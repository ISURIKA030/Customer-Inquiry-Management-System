
import { Router } from "express";
import { login } from "../controllers/auth_controllers.js";

const router = Router();

router.post("/login", login);

export default router;
