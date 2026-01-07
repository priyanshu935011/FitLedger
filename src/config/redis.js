import Redis from "ioredis";

let redis = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    lazyConnect: true, // 👈 critical
    maxRetriesPerRequest: 0,
    retryStrategy: () => null,
  });

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  redis.on("error", (err) => {
    console.warn("Redis error:", err.message);
  });
}

export { redis };
