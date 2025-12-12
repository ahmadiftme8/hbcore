/**
 * API endpoint constants
 * Centralized to avoid magic strings and typos
 */

export const API_ENDPOINTS = {
  AUTH: {
    FIREBASE: '/auth/firebase',
    PHONE: {
      REQUEST_OTP: '/auth/phone/request-otp',
      VERIFY_OTP: '/auth/phone/verify-otp',
    },
  },
} as const;

