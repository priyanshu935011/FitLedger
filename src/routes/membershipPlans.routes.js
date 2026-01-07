import express from "express";
import { auth } from "../middlewares/auth.js";
import * as controller from "../controllers/membershipPlans.controller.js";
import { member } from "../middlewares/member.js";
const router = express.Router();

router.get("/", auth, member, controller.getPlans);
router.post("/", auth, member, controller.createPlan);
router.put("/:id", auth, member, controller.updatePlan);
router.delete("/:id", auth, member, member, controller.deletePlan);

export default router;
