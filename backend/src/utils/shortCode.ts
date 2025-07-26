import { nanoid, customAlphabet } from "nanoid";
import { config } from "../config/index.js";

const generateShortCode = customAlphabet(
  config.shortCode.alphabet,
  config.shortCode.length
);

export const createShortCode = (): string => {
  return generateShortCode();
};

export const isValidShortCode = (code: string): boolean => {
  const regex = new RegExp(`^[${config.shortCode.alphabet}]{${config.shortCode.length}}$`);
  return regex.test(code);
};