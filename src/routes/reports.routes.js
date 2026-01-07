import express from "express";
import { auth } from "../middlewares/auth.js";
import * as controller from "../controllers/reports.controller.js";

const router = express.Router();

router.get("/summary", auth, controller.getMonthlySummary);

export default router;
