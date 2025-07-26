import { Router } from "express";
import { UrlService } from "../services/urlService.js";
import { isValidShortCode } from "../utils/shortCode.js";
import type { Request, Response, NextFunction } from "express";

const router = Router();
const urlService = new UrlService();

// GET /:shortCode - Redirect to original URL
router.get("/:shortCode", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortCode } = req.params;
    
    if (!shortCode || !isValidShortCode(shortCode)) {
      return res.status(404).json({
        error: "Invalid short code",
      });
    }
    
    const url = await urlService.getUrl(shortCode);
    
    if (!url || !url.isActive) {
      return res.status(404).json({
        error: "URL not found or inactive",
      });
    }
    
    // Check if URL has expired
    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).json({
        error: "URL has expired",
      });
    }
    
    // Record the click for analytics
    await urlService.recordClick(shortCode, {
      ip: req.ip || "unknown",
      userAgent: req.get("User-Agent"),
      referer: req.get("Referer"),
    });
    
    // Redirect to original URL
    res.redirect(301, url.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

export { router as redirectRouter };