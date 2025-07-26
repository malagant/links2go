import type { AppConfig } from "../types/index.js";

export const config: AppConfig = {
  port: Number(process.env.PORT) || 3001,
  baseUrl: process.env.BASE_URL || "http://localhost:3001",
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: Number(process.env.REDIS_DB) || 0,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
  },
  shortCode: {
    length: 6,
    alphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  },
};