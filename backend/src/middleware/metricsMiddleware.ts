import type { Request, Response, NextFunction } from "express";
import { metricsService } from "../services/metricsService.js";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Continue with the request
  next();
  
  // Record metrics after response is sent
  res.on("finish", () => {
    const duration = (Date.now() - startTime) / 1000; // Convert to seconds
    const route = getRoutePattern(req.route?.path || req.path);
    
    metricsService.incrementHttpRequests(req.method, route, res.statusCode);
    metricsService.observeRequestDuration(req.method, route, res.statusCode, duration);
  });
};

// Helper function to normalize route patterns for metrics
const getRoutePattern = (path: string): string => {
  // Replace dynamic segments with placeholders
  return path
    .replace(/\/[a-zA-Z0-9]{6}$/, "/:shortCode") // Short codes
    .replace(/\/[0-9]+/g, "/:id") // Numeric IDs
    .replace(/\/[a-f0-9-]{36}/g, "/:uuid") // UUIDs
    || "/unknown";
};