import express from "express";
import { sendPasswordSetupEmail } from "../services/email.service.js";
import { auth } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/adminOnly.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const router = express.Router();

router.post("/send-password-setup", auth, adminOnly, sendPasswordSetupEmail);
router.get("/test-resend", async (req, res) => {
  const result = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "priyanshugiri63@gmail.com",
    subject: "Resend Test",
    html: "<h1>Resend works</h1>",
  });

  res.json(result);
});

export default router;
