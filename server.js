import app from "./app.js";
import { redis } from "./src/config/redis.js";

const PORT = process.env.PORT || 4000;

/* -------------------------
   Start Server
-------------------------- */
const startServer = async () => {
  try {
    // Verify Redis connection

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
