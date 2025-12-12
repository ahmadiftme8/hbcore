import type { Phone } from '@hbcore/types';
import { BadRequestException, Injectable } from '@nestjs/common';

/**
 * E.164 format regex: + followed by 1-15 digits
 * Iran country code: +98
 */
const E164_REGEX = /^\+[1-9]\d{1,14}$/;
const IRAN_COUNTRY_CODE = '+98';

@Injectable()
export class PhoneValidationService {
  /**
   * Validate phone number format and country code
   * @param phone - Phone number to validate
   * @returns Normalized phone number in E.164 format
   * @throws BadRequestException if phone is invalid
   */
  validatePhone(phone: string): Phone {
    if (!phone || typeof phone !== 'string') {
      throw new BadRequestException('Phone number is required');
    }

    // Normalize phone number
    const normalized = this.normalizePhone(phone);

    // Validate E.164 format
    if (!E164_REGEX.test(normalized)) {
      throw new BadRequestException('Phone number must be in E.164 format (e.g., +989123456789)');
    }

    // Enforce Iran country code only
    if (!normalized.startsWith(IRAN_COUNTRY_CODE)) {
      throw new BadRequestException('Only Iran phone numbers (+98) are supported');
    }

    // Validate Iran phone number length (should be +98 followed by 10 digits)
    // Total length: +98 (3 chars) + 10 digits = 13 characters
    if (normalized.length !== 13) {
      throw new BadRequestException('Iran phone number must be 10 digits after country code (e.g., +989123456789)');
    }

    return normalized as Phone;
  }

  /**
   * Normalize phone number to E.164 format
   * @param phone - Phone number to normalize
   * @returns Normalized phone number
   */
  normalizePhone(phone: string): string {
    // Remove all whitespace and special characters except +
    let normalized = phone.trim().replace(/[\s\-()]/g, '');

    // If phone doesn't start with +, assume it's Iran and add +98
    if (!normalized.startsWith('+')) {
      // Remove leading 0 if present (Iran local format: 09123456789)
      if (normalized.startsWith('0')) {
        normalized = normalized.substring(1);
      }
      // Add Iran country code
      normalized = IRAN_COUNTRY_CODE + normalized;
    }

    return normalized;
  }

  /**
   * Check if phone number is valid without throwing
   * @param phone - Phone number to check
   * @returns true if valid, false otherwise
   */
  isValidPhone(phone: string): boolean {
    try {
      this.validatePhone(phone);
      return true;
    } catch {
      return false;
    }
  }
}
