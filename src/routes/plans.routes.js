import express from "express";
import { auth } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/adminOnly.js";
import { listPlans, updatePlan } from "../controllers/plans.controller.js";

const router = express.Router();

router.get("/", auth, listPlans);
router.put("/:id", auth, adminOnly, updatePlan);

export default router;
