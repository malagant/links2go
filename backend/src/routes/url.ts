import { Router } from "express";
import QRCode from "qrcode";
import { UrlService } from "../services/urlService.js";
import { urlSchema, shortCodeSchema } from "../utils/validation.js";
import { createError } from "../middleware/errorHandler.js";
import type { Request, Response, NextFunction } from "express";

const router = Router();
const urlService = new UrlService();

// POST /api/shorten - Create shortened URL
router.post("/shorten", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = urlSchema.parse(req.body);
    
    const result = await urlService.shortenUrl(validatedData);
    
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(createError(error.message, 400));
    } else {
      next(createError("Failed to shorten URL", 400));
    }
  }
});

// GET /api/analytics/:shortCode - Get URL analytics
router.get("/analytics/:shortCode", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortCode } = shortCodeSchema.parse(req.params);
    
    const analytics = await urlService.getAnalytics(shortCode);
    
    if (!analytics) {
      return next(createError("URL not found", 404));
    }
    
    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(createError(error.message, 400));
    } else {
      next(createError("Failed to fetch analytics", 400));
    }
  }
});

// GET /api/qr/:shortCode - Generate QR code
router.get("/qr/:shortCode", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortCode } = shortCodeSchema.parse(req.params);
    
    const url = await urlService.getUrl(shortCode);
    
    if (!url) {
      return next(createError("URL not found", 404));
    }
    
    const shortUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);
    
    res.json({
      success: true,
      data: {
        qrCode: qrCodeDataUrl,
        shortUrl,
        originalUrl: url.originalUrl,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      next(createError(error.message, 400));
    } else {
      next(createError("Failed to generate QR code", 400));
    }
  }
});

// DELETE /api/:shortCode - Delete shortened URL
router.delete("/:shortCode", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortCode } = shortCodeSchema.parse(req.params);
    
    const deleted = await urlService.deleteUrl(shortCode);
    
    if (!deleted) {
      return next(createError("URL not found", 404));
    }
    
    res.json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      next(createError(error.message, 400));
    } else {
      next(createError("Failed to delete URL", 400));
    }
  }
});

export { router as urlRouter };