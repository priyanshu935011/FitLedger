import express from "express";
import { sendPasswordSetupEmail } from "../services/email.service.js";
import { auth } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const router = express.Router();

router.post("/send-password-setup", auth, adminOnly, sendPasswordSetupEmail);

export default router;
