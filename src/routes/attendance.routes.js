import express from "express";
import { auth } from "../middlewares/auth.js";
import { member } from "../middlewares/member.js";
import * as controller from "../controllers/attendance.controller.js";

const router = express.Router();

router.post("/check-in", auth, member, controller.checkIn);
router.get("/today", auth, member, controller.getTodayAttendance);

export default router;
