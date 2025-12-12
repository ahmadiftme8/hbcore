import axios from 'axios';
import { logger } from '../utils/logger';

/**
 * HTTP Error with response data
 */
export interface HttpError extends Error {
  response?: {
    data: unknown;
    status: number;
    statusText: string;
    headers: Headers;
  };
}

/**
 * Network Error
 */
export class NetworkError extends Error {
  constructor(
    message: string,
    public readonly url: string,
    public readonly baseURL: string,
    cause?: unknown,
  ) {
    super(message);
    this.name = 'NetworkError';
    this.cause = cause;
  }
}

/**
 * Check if error is a timeout error
 */
function isTimeoutError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  // Axios uses 'ECONNABORTED' code for timeout errors
  if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
    return true;
  }

  return (
    error.name === 'TimeoutError' ||
    error.message.toLowerCase().includes('timeout') ||
    error.message.toLowerCase().includes('timed out')
  );
}

/**
 * Check if error is a network error
 */
function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  // Axios network errors don't have a response
  if (axios.isAxiosError(error) && !error.response && error.request) {
    return true;
  }

  const errorMessage = error.message.toLowerCase();
  return (
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('networkerror') ||
    errorMessage.includes('network request failed') ||
    errorMessage.includes('load failed') ||
    errorMessage.includes('network error')
  );
}

/**
 * Create timeout error with helpful message
 */
function createTimeoutError(error: Error, fullUrl: string, baseURL: string): NetworkError {
  const message =
    `Request timeout: The request to ${fullUrl} timed out.\n` +
    `Possible causes:\n` +
    `1. API server is not running on ${baseURL}\n` +
    `2. API server is running but not responding (check server logs)\n` +
    `3. Network connectivity issue\n` +
    `4. Server is overloaded or processing slowly\n\n` +
    `Original error: ${error.message}`;

  return new NetworkError(message, fullUrl, baseURL, error);
}

/**
 * Create network error with helpful message
 */
function createNetworkError(error: Error, fullUrl: string, baseURL: string): NetworkError {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'unknown';
  const message =
    `Network error: Unable to connect to ${fullUrl}.\n` +
    `Possible causes:\n` +
    `1. API server is not running on ${baseURL}\n` +
    `2. CORS configuration issue - check if ${origin} is in CORS_ORIGINS\n` +
    `3. Network connectivity issue\n\n` +
    `Original error: ${error.message}`;

  return new NetworkError(message, fullUrl, baseURL, error);
}

/**
 * Handle HTTP request errors
 * Extracts error information and formats it appropriately
 */
export async function handleHttpError(error: unknown, method: string, url: string, baseURL: string): Promise<never> {
  // Construct full URL properly, handling edge cases
  const normalizedBaseURL = baseURL.replace(/\/$/, '');
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  const fullUrl = `${normalizedBaseURL}${normalizedUrl}`;
  logger.error(`HTTP Request failed: ${method.toUpperCase()} ${fullUrl}`);

  // Log detailed error information
  if (error instanceof Error) {
    logger.error('Error name:', error.name);
    logger.error('Error message:', error.message);
    logger.error('Error stack:', error.stack);
    if ('cause' in error) {
      logger.error('Error cause:', error.cause);
    }
  } else {
    logger.error('Error object:', error);
  }

  // Handle HTTP errors - Axios throws AxiosError for non-2xx responses
  if (axios.isAxiosError(error) && error.response) {
    const response = error.response;

    // Axios already parses the response data
    const errorData = response.data ?? {
      message: `HTTP ${response.status}: ${response.statusText}`,
    };

    logger.error('Server error response:', {
      status: response.status,
      statusText: response.statusText,
      body: errorData,
    });

    // Convert axios headers to Headers object
    const headers = new Headers();
    if (response.headers) {
      Object.entries(response.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers.set(key, value);
        } else if (Array.isArray(value)) {
          headers.set(key, value.join(', '));
        }
      });
    }

    const httpErrorWithResponse: HttpError = {
      name: 'HttpError',
      message: `HTTP ${response.status}: ${response.statusText}`,
      response: {
        data: errorData,
        status: response.status,
        statusText: response.statusText,
        headers,
      },
    } as HttpError;

    // Copy error properties
    if (error instanceof Error) {
      httpErrorWithResponse.stack = error.stack;
      httpErrorWithResponse.cause = error.cause;
    }

    throw httpErrorWithResponse;
  }

  // Handle timeout errors (check before network errors for more specific message)
  if (error instanceof Error && isTimeoutError(error)) {
    throw createTimeoutError(error, fullUrl, baseURL);
  }

  // Handle network errors
  if (error instanceof Error && isNetworkError(error)) {
    throw createNetworkError(error, fullUrl, baseURL);
  }

  // Re-throw unknown errors
  throw error;
}
