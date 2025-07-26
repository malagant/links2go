export interface ShortenUrlRequest {
  url: string;
  customCode?: string;
  expiresIn?: number; // seconds
}

export interface ShortenUrlResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  expiresAt?: string;
}

export interface ClickEvent {
  timestamp: string;
  ip: string;
  userAgent?: string;
  referer?: string;
}

export interface AnalyticsResponse {
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  expiresAt?: string;
  recentClicks: ClickEvent[];
}

export interface QRCodeResponse {
  qrCode: string; // Data URL
  shortUrl: string;
  originalUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  error: string;
  details?: string;
}