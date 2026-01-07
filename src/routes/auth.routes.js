import express from "express";
import {
  signup,
  login,
  me,
  validateToken,
} from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, me);
router.get("/validate", validateToken);
export default router;
