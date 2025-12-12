/**
 * Phone validation constants and utilities
 * Matches backend validation in phone-validation.service.ts
 */

/**
 * Expected phone number length in E.164 format for Iran
 * Format: +98XXXXXXXXXX (13 characters total: +98 + 10 digits)
 */
export const PHONE_LENGTH = 13;

/**
 * OTP code length
 */
export const OTP_LENGTH = 6;

/**
 * Normalize an Iran phone number to E.164 format (+98XXXXXXXXXX).
 * Accepts inputs like:
 * - E.164 format: +989388727940 (already normalized)
 * - Local format with 0: 09388727940
 * - Local format without 0: 9388727940
 * - With country code: 989388727940
 * Returns null if the number cannot be normalized.
 */
export function normalizeIranPhone(phone: string): string | null {
  if (!phone || typeof phone !== 'string') {
    return null;
  }

  // Remove spaces, dashes, parentheses and Persian/Arabic numerals
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const westernDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const toWestern = (value: string) => value.replace(/[۰-۹]/g, (d) => westernDigits[persianDigits.indexOf(d)]);

  let cleaned = toWestern(phone.trim()).replace(/[()\s-]/g, '');

  // If already in E.164 format (+989388727940), validate and return
  if (cleaned.startsWith('+98')) {
    cleaned = cleaned.slice(3); // Remove '+98'
    if (/^9\d{9}$/.test(cleaned)) {
      return `+98${cleaned}`;
    }
    return null;
  }

  // Remove leading +
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1);
  }

  // If starts with 98, remove it (country code)
  if (cleaned.startsWith('98')) {
    cleaned = cleaned.slice(2);
  }

  // Remove leading 0 if present (local format 09XXXXXXXXX)
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }

  // After normalization we should have exactly 10 digits starting with 9
  if (!/^9\d{9}$/.test(cleaned)) {
    return null;
  }

  return `+98${cleaned}`;
}

/**
 * Validate phone number length
 * @param phone - Phone number to validate
 * @returns true if phone length is valid
 */
export function isValidPhoneLength(phone: string): boolean {
  return phone.length === PHONE_LENGTH;
}

/**
 * Validate an Iran phone number (accepts local formats) and returns E.164 validity
 */
export function isValidIranPhone(phone: string): boolean {
  const normalized = normalizeIranPhone(phone);
  return !!normalized && normalized.length === PHONE_LENGTH;
}

/**
 * Validate OTP code length
 * @param otp - OTP code to validate
 * @returns true if OTP length is valid
 */
export function isValidOtpLength(otp: string): boolean {
  return otp.length === OTP_LENGTH;
}
