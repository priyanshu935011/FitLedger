import { redis } from "../config/redis.js";

export const cacheGet = async (key) => {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const cacheSet = async (key, value, ttl = 300) => {
  if (!redis) return;
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch {}
};

export const cacheDel = async (key) => {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch {}
};
