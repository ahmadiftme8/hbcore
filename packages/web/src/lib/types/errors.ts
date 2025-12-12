import type { FirebaseError } from 'firebase/app';
import type { HttpError, NetworkError } from '../http/error-handler';

/**
 * API Error with response data
 */
export interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
    statusText?: string;
  };
}

/**
 * Type guard for ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error !== null && typeof error === 'object' && ('response' in error || 'message' in error);
}

/**
 * Type guard for FirebaseError
 */
export function isFirebaseError(error: unknown): error is FirebaseError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

/**
 * Type guard for HttpError
 */
export function isHttpError(error: unknown): error is HttpError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'response' in error &&
    typeof (error as { response: unknown }).response === 'object'
  );
}

/**
 * Type guard for NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof Error && error.name === 'NetworkError';
}

/**
 * Extract error message from various error types
 */
export function extractErrorMessage(error: unknown, defaultMessage: string): string {
  if (isApiError(error)) {
    return error.response?.data?.message || error.message || defaultMessage;
  }

  if (isFirebaseError(error)) {
    return error.message || defaultMessage;
  }

  if (isHttpError(error)) {
    const responseData = error.response?.data;

    // Handle NestJS error format: { statusCode, message, error }
    if (responseData && typeof responseData === 'object') {
      // Check for NestJS error format
      if ('message' in responseData) {
        const message = responseData.message;
        // NestJS sometimes returns message as an array
        if (Array.isArray(message)) {
          return message.join(', ') || defaultMessage;
        }
        if (typeof message === 'string' && message) {
          return message;
        }
      }

      // Check for other common error formats
      if ('error' in responseData && typeof responseData.error === 'string') {
        return responseData.error;
      }
    }

    // Fallback to error message or default
    return error.message || defaultMessage;
  }

  // Handle NetworkError - format message for HTML display
  if (isNetworkError(error)) {
    // Replace newlines with spaces and trim extra whitespace
    // This makes the message display as a single line in HTML
    return error.message.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim() || defaultMessage;
  }

  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  return defaultMessage;
}
