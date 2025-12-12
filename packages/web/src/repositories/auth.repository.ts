import { API_ENDPOINTS } from '../lib/constants/api-endpoints';
import { apiClient } from './api-client';
import type { PhoneOtpRequestResponse, PhoneOtpVerifyResponse } from './types';

/**
 * Auth Repository
 * Handles all authentication-related API calls
 */
export class AuthRepository {
  /**
   * Authenticate with Firebase ID token
   * @deprecated Google/Firebase authentication is disabled
   */
  // async authenticateWithFirebase(idToken: string): Promise<User & UserInfo> {
  //   const response = await apiClient.post<FirebaseAuthResponse>(API_ENDPOINTS.AUTH.FIREBASE, {
  //     idToken,
  //   });
  //   return response.data.user;
  // }

  /**
   * Request OTP for phone authentication
   */
  async requestOtp(phone: string, turnstileToken: string): Promise<string> {
    console.log('📞 AuthRepository.requestOtp called', {
      endpoint: API_ENDPOINTS.AUTH.PHONE.REQUEST_OTP,
      phone,
      turnstileToken: turnstileToken ? 'present' : 'missing',
    });
    const response = await apiClient.post<PhoneOtpRequestResponse>(
      API_ENDPOINTS.AUTH.PHONE.REQUEST_OTP,
      {
        phone,
        turnstileToken,
      },
      {
        timeout: 30000, // 30 second timeout for OTP requests (includes Turnstile verification and Redis operations)
      },
    );
    console.log('✅ AuthRepository.requestOtp response:', response);
    return response.data.message;
  }

  /**
   * Verify OTP and get authentication token
   */
  async verifyOtp(phone: string, code: string): Promise<PhoneOtpVerifyResponse> {
    const response = await apiClient.post<PhoneOtpVerifyResponse>(API_ENDPOINTS.AUTH.PHONE.VERIFY_OTP, {
      phone,
      code,
    });
    return response.data;
  }
}

export const authRepository = new AuthRepository();
