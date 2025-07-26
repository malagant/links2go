export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  expiresAt?: Date;
  clickCount: number;
  isActive: boolean;
}

export interface UrlAnalytics {
  shortCode: string;
  clickCount: number;
  clicks: ClickEvent[];
}

export interface ClickEvent {
  timestamp: Date;
  ip: string;
  userAgent?: string;
  referer?: string;
}

export interface ShortenUrlRequest {
  url: string;
  customCode?: string;
  expiresIn?: number; // seconds
}

export interface ShortenUrlResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  expiresAt?: Date;
}

export interface AnalyticsResponse {
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: Date;
  expiresAt?: Date;
  recentClicks: ClickEvent[];
}

export interface AppConfig {
  port: number;
  baseUrl: string;
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
  shortCode: {
    length: number;
    alphabet: string;
  };
}