import type { User, UserInfo } from '@hbcore/types';

/**
 * Firebase authentication response
 */
export interface FirebaseAuthResponse {
  user: User & UserInfo;
}

/**
 * Phone OTP request response
 */
export interface PhoneOtpRequestResponse {
  message: string;
}

/**
 * Phone OTP verification response
 */
export interface PhoneOtpVerifyResponse {
  user: User & UserInfo;
  token: string;
}

