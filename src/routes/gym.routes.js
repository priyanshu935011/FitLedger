import express from "express";
import { auth } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/adminOnly.js";
import {
  createGym,
  listGyms,
  getGymById,
  updateGym,
  archiveGym,
} from "../controllers/gym.controller.js";

const router = express.Router();

router.post("/", auth, adminOnly, createGym);
router.get("/", auth, adminOnly, listGyms);
router.get("/:id", auth, adminOnly, getGymById);
router.put("/:id", auth, adminOnly, updateGym);
router.patch("/:id/archive", auth, adminOnly, archiveGym);
export default router;
