import express from "express";
import { auth } from "../middlewares/auth.js";
import { member } from "../middlewares/member.js";
import * as controller from "../controllers/member.controller.js";

const router = express.Router();

router.post("/", auth, member, controller.createMember);
router.get("/", auth, member, controller.getMembers);
router.get("/:id", auth, member, controller.getMemberById);
router.put("/:id", auth, member, controller.updateMember);
router.delete("/:id", auth, member, controller.deleteMember);
export default router;
