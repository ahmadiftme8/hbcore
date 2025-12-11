/**
 * HTTP client type definitions
 */

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  retry?: {
    limit?: number;
    methods?: string[];
    statusCodes?: number[];
  };
  headers?: Record<string, string>;
}

export interface HttpClientRequestOptions {
  headers?: Record<string, string>;
  searchParams?: Record<string, string | number | boolean>;
  timeout?: number;
  retry?: number;
}

export interface HttpClientResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
