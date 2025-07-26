import rateLimit from "express-rate-limit";
import { config } from "../config/index.js";

export const createRateLimiter = () => {
  return rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
      error: "Too many requests from this IP, please try again later.",
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};