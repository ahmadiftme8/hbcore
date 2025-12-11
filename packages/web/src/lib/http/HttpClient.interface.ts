import type { HttpClientRequestOptions, HttpClientResponse } from './types';

/**
 * HTTP Client Interface
 * Defines the contract for HTTP client implementations
 */
export interface IHttpClient {
  /**
   * Perform a GET request
   */
  get<T = unknown>(url: string, options?: HttpClientRequestOptions): Promise<HttpClientResponse<T>>;

  /**
   * Perform a POST request
   */
  post<T = unknown>(
    url: string,
    options?: HttpClientRequestOptions & { json?: unknown },
  ): Promise<HttpClientResponse<T>>;

  /**
   * Perform a PUT request
   */
  put<T = unknown>(
    url: string,
    options?: HttpClientRequestOptions & { json?: unknown },
  ): Promise<HttpClientResponse<T>>;

  /**
   * Perform a DELETE request
   */
  delete<T = unknown>(url: string, options?: HttpClientRequestOptions): Promise<HttpClientResponse<T>>;

  /**
   * Perform a PATCH request
   */
  patch<T = unknown>(
    url: string,
    options?: HttpClientRequestOptions & { json?: unknown },
  ): Promise<HttpClientResponse<T>>;

  /**
   * Set a function to get the authentication token
   */
  setTokenGetter(getter: () => Promise<string | null>): void;
}
