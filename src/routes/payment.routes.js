import express from "express";
import { auth } from "../middlewares/auth.js";
import { member } from "../middlewares/member.js";
import * as controller from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/", auth, member, controller.createPayment);
router.get("/recent", auth, member, controller.getRecentPayments);
router.get("/pay/:id", auth, member, controller.delParticularPayment);
export default router;
