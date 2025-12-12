import type { IHttpClient } from '../lib/http/HttpClient.interface';
import { createHttpClient } from '../lib/http/httpClient';
import type { HttpClientRequestOptions } from '../lib/http/types';
import { logger } from '../lib/utils/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Log API URL in development for debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  logger.info(`🔗 API Base URL: ${API_BASE_URL}`);
}

/**
 * API Client
 * Provides API-specific methods using the HTTP client
 */
class ApiClient {
  private httpClient: IHttpClient;

  constructor() {
    this.httpClient = createHttpClient({
      baseURL: API_BASE_URL,
      timeout: 10000,
      retry: {
        limit: 2,
        methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
        statusCodes: [408, 429, 500, 502, 503, 504],
      },
    });
  }

  /**
   * Set a function to get the auth token
   */
  setTokenGetter(getter: () => Promise<string | null>): void {
    this.httpClient.setTokenGetter(getter);
  }

  /**
   * Perform a GET request
   */
  async get<T>(url: string, config?: HttpClientRequestOptions) {
    return this.httpClient.get<T>(url, config);
  }

  /**
   * Perform a POST request
   */
  async post<T>(url: string, data?: unknown, config?: HttpClientRequestOptions) {
    return this.httpClient.post<T>(url, { ...config, json: data });
  }

  /**
   * Perform a PUT request
   */
  async put<T>(url: string, data?: unknown, config?: HttpClientRequestOptions) {
    return this.httpClient.put<T>(url, { ...config, json: data });
  }

  /**
   * Perform a DELETE request
   */
  async delete<T>(url: string, config?: HttpClientRequestOptions) {
    return this.httpClient.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();

