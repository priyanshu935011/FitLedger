import express from "express";
import { auth } from "../middlewares/auth.js";
import { adminOnly } from "../middlewares/adminOnly.js";
import {
  extendSubscription,
  listSubscriptions,
} from "../controllers/subscriptions.controller.js";

const router = express.Router();

router.get("/", auth, adminOnly, listSubscriptions);
router.post("/extend", auth, adminOnly, extendSubscription);

export default router;
