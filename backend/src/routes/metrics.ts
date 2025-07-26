import { Router } from "express";
import { metricsService } from "../services/metricsService.js";
import type { Request, Response } from "express";

const router = Router();

// GET /metrics - Prometheus metrics endpoint
router.get("/metrics", async (req: Request, res: Response) => {
  try {
    const metrics = await metricsService.getMetrics();
    
    res.set("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
    res.send(metrics);
  } catch (error) {
    console.error("Error generating metrics:", error);
    res.status(500).send("Error generating metrics");
  }
});

export { router as metricsRouter };