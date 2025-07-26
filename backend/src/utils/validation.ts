import { z } from "zod";

export const urlSchema = z.object({
  url: z.string().url("Invalid URL format"),
  customCode: z.string().optional(),
  expiresIn: z.number().positive().optional(),
});

export const shortCodeSchema = z.object({
  shortCode: z.string().min(1, "Short code is required"),
});

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    // Remove dangerous protocols
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Only HTTP and HTTPS protocols are allowed");
    }
    return parsedUrl.toString();
  } catch {
    throw new Error("Invalid URL");
  }
};