import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./src/routes/auth.routes.js";
import gymRoutes from "./src/routes/gym.routes.js";
import memberRoutes from "./src/routes/member.routes.js";
import planRoutes from "./src/routes/plans.routes.js";
import subscriptionRoutes from "./src/routes/subscription.routes.js";
import emailRoutes from "./src/routes/email.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import DashboardRoutes from "./src/routes/dashboard.route.js";
import reportsRoutes from "./src/routes/reports.routes.js";
import membershipPlansRoutes from "./src/routes/membershipPlans.routes.js";
import gymProfileRoutes from "./src/routes/gymProfiles.routes.js";
const app = express();

/* -------------------------
   Global Middlewares
-------------------------- */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* -------------------------
   Health Check
-------------------------- */
app.get("/health", (_, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

/* -------------------------
   Routes
-------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/gyms", gymRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", DashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/membership-plans", membershipPlansRoutes);
app.use("/api/gymProfile", gymProfileRoutes);
/* -------------------------
   404 Handler
-------------------------- */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

/* -------------------------
   Error Handler
-------------------------- */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal server error",
  });
});

export default app;
