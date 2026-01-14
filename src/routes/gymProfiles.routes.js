import { Router } from "express";
import {
  getOwnerGymProfile,
  updateOwnerGymProfile,
  getPublicGymProfile,
  addGymPhoto,
  deleteGymPhoto,
} from "../controllers/gymProfile.controller.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

/* OWNER */
router.get("/owner/gym/profile", auth, getOwnerGymProfile);
router.put("/owner/gym/profile", auth, updateOwnerGymProfile);

/* PHOTOS */
router.post("/owner/gym/photos", auth, addGymPhoto);
router.delete("/owner/gym/photos/:id", auth, deleteGymPhoto);

/* PUBLIC */
router.get("/public/gym/:slug", getPublicGymProfile);

export default router;
