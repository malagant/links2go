import axios from 'axios';
import type {
  ShortenUrlRequest,
  ShortenUrlResponse,
  AnalyticsResponse,
  QRCodeResponse,
  ApiResponse,
  ApiError,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const apiError: ApiError = {
        error: error.response.data?.error || 'Server error',
        details: error.response.data?.details,
      };
      throw apiError;
    } else if (error.request) {
      // Network error
      const apiError: ApiError = {
        error: 'Network error - unable to reach server',
        details: 'Please check your internet connection and try again',
      };
      throw apiError;
    } else {
      // Something else happened
      const apiError: ApiError = {
        error: 'An unexpected error occurred',
        details: error.message,
      };
      throw apiError;
    }
  }
);

export const urlService = {
  // Shorten a URL
  async shortenUrl(request: ShortenUrlRequest): Promise<ShortenUrlResponse> {
    const response = await api.post<ApiResponse<ShortenUrlResponse>>('/api/shorten', request);
    return response.data.data;
  },

  // Get analytics for a short code
  async getAnalytics(shortCode: string): Promise<AnalyticsResponse> {
    const response = await api.get<ApiResponse<AnalyticsResponse>>(`/api/analytics/${shortCode}`);
    return response.data.data;
  },

  // Generate QR code for a short code
  async getQRCode(shortCode: string): Promise<QRCodeResponse> {
    const response = await api.get<ApiResponse<QRCodeResponse>>(`/api/qr/${shortCode}`);
    return response.data.data;
  },

  // Delete a shortened URL
  async deleteUrl(shortCode: string): Promise<void> {
    await api.delete(`/api/${shortCode}`);
  },

  // Check server health
  async checkHealth(): Promise<boolean> {
    try {
      await api.get('/health');
      return true;
    } catch {
      return false;
    }
  },
};

export default api;