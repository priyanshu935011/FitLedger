import express from "express";
import { auth } from "../middlewares/auth.js";
import * as controller from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/summary", auth, controller.getSummary);

export default router;
