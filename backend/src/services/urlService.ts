import { redis } from "../config/redis.js";
import { createShortCode, isValidShortCode } from "../utils/shortCode.js";
import { sanitizeUrl } from "../utils/validation.js";
import { metricsService } from "./metricsService.js";
import type {
  ShortenedUrl,
  UrlAnalytics,
  ClickEvent,
  ShortenUrlRequest,
  ShortenUrlResponse,
  AnalyticsResponse,
} from "../types/index.js";
import { config } from "../config/index.js";

export class UrlService {
  private readonly URL_PREFIX = "url:";
  private readonly ANALYTICS_PREFIX = "analytics:";

  async shortenUrl(request: ShortenUrlRequest): Promise<ShortenUrlResponse> {
    const sanitizedUrl = sanitizeUrl(request.url);
    
    let shortCode = request.customCode;
    
    if (shortCode) {
      if (!isValidShortCode(shortCode)) {
        throw new Error("Invalid custom short code format");
      }
      
      const exists = await this.getUrl(shortCode);
      if (exists) {
        throw new Error("Custom short code already exists");
      }
    } else {
      shortCode = await this.generateUniqueShortCode();
    }

    const expiresAt = request.expiresIn 
      ? new Date(Date.now() + request.expiresIn * 1000)
      : undefined;

    const shortenedUrl: ShortenedUrl = {
      id: shortCode,
      originalUrl: sanitizedUrl,
      shortCode,
      createdAt: new Date(),
      expiresAt,
      clickCount: 0,
      isActive: true,
    };

    await redis.hSet(
      `${this.URL_PREFIX}${shortCode}`,
      {
        originalUrl: shortenedUrl.originalUrl,
        createdAt: shortenedUrl.createdAt.toISOString(),
        expiresAt: shortenedUrl.expiresAt?.toISOString() || "",
        clickCount: "0",
        isActive: "true",
      }
    );

    if (expiresAt) {
      await redis.expireAt(`${this.URL_PREFIX}${shortCode}`, Math.floor(expiresAt.getTime() / 1000));
    }

    // Record metrics
    metricsService.incrementUrlsShortened(!!request.customCode);

    return {
      shortCode,
      shortUrl: `${config.baseUrl}/${shortCode}`,
      originalUrl: sanitizedUrl,
      expiresAt,
    };
  }

  async getUrl(shortCode: string): Promise<ShortenedUrl | null> {
    const data = await redis.hGetAll(`${this.URL_PREFIX}${shortCode}`);
    
    if (!data.originalUrl) {
      return null;
    }

    return {
      id: shortCode,
      originalUrl: data.originalUrl,
      shortCode,
      createdAt: new Date(data.createdAt),
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      clickCount: Number(data.clickCount) || 0,
      isActive: data.isActive === "true",
    };
  }

  async recordClick(shortCode: string, clickEvent: Omit<ClickEvent, "timestamp">): Promise<void> {
    const click: ClickEvent = {
      ...clickEvent,
      timestamp: new Date(),
    };

    try {
      // Increment click count
      await redis.hIncrBy(`${this.URL_PREFIX}${shortCode}`, "clickCount", 1);

      // Store click event for analytics
      await redis.lPush(
        `${this.ANALYTICS_PREFIX}${shortCode}`,
        JSON.stringify(click)
      );

      // Keep only last 100 clicks
      await redis.lTrim(`${this.ANALYTICS_PREFIX}${shortCode}`, 0, 99);
    } catch (error) {
      console.error("Error recording click:", error);
      // Don't throw error to avoid breaking the redirect
    }
  }

  async getAnalytics(shortCode: string): Promise<AnalyticsResponse | null> {
    const url = await this.getUrl(shortCode);
    if (!url) {
      return null;
    }

    const clicksData = await redis.lRange(`${this.ANALYTICS_PREFIX}${shortCode}`, 0, -1);
    const recentClicks: ClickEvent[] = clicksData.map((clickData) => JSON.parse(clickData));

    return {
      shortCode,
      originalUrl: url.originalUrl,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      recentClicks,
    };
  }

  async deleteUrl(shortCode: string): Promise<boolean> {
    const pipeline = redis.multi();
    pipeline.del(`${this.URL_PREFIX}${shortCode}`);
    pipeline.del(`${this.ANALYTICS_PREFIX}${shortCode}`);
    
    const results = await pipeline.exec();
    return results ? results[0] > 0 : false;
  }

  private async generateUniqueShortCode(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const shortCode = createShortCode();
      const exists = await this.getUrl(shortCode);
      
      if (!exists) {
        return shortCode;
      }
      
      attempts++;
    }

    throw new Error("Unable to generate unique short code");
  }
}