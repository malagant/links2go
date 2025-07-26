import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectRedis } from "./config/redis.js";
import { config } from "./config/index.js";
import { createRateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { urlRouter } from "./routes/url.js";
import { redirectRouter } from "./routes/redirect.js";
import { metricsRouter } from "./routes/metrics.js";
import { metricsMiddleware } from "./middleware/metricsMiddleware.js";
import { metricsService } from "./services/metricsService.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

// Rate limiting
app.use(createRateLimiter());

// Metrics middleware
app.use(metricsMiddleware);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/", metricsRouter);
app.use("/api", urlRouter);
app.use("/", redirectRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectRedis();
    metricsService.setRedisConnected(true);
    
    app.listen(config.port, () => {
      console.log(`🚀 Links2Go backend running on port ${config.port}`);
      console.log(`📊 Health check: http://localhost:${config.port}/health`);
      console.log(`📈 Metrics: http://localhost:${config.port}/metrics`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    metricsService.setRedisConnected(false);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

startServer();