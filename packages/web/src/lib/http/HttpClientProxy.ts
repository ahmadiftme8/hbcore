import type { AfterResponseHook, BeforeRequestHook } from 'ky';
import ky, { type KyInstance } from 'ky';
import type { IHttpClient } from './HttpClient.interface';
import type { HttpClientConfig, HttpClientRequestOptions, HttpClientResponse, HttpMethod } from './types';

/**
 * HTTP Client Proxy Implementation
 * Uses Proxy pattern to intercept HTTP method calls and add cross-cutting concerns
 */
export class HttpClientProxy implements IHttpClient {
  private kyInstance: KyInstance;
  private tokenGetter?: () => Promise<string | null>;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig = {}) {
    this.config = config;

    // Create Ky instance with retry configuration
    const retryConfig = {
      limit: config.retry?.limit ?? 2,
      methods: config.retry?.methods ?? ['get', 'put', 'head', 'delete', 'options', 'trace'],
      statusCodes: config.retry?.statusCodes ?? [408, 429, 500, 502, 503, 504],
    };

    this.kyInstance = ky.create({
      prefixUrl: config.baseURL ?? '',
      timeout: config.timeout ?? 10000,
      retry: retryConfig,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      hooks: {
        beforeRequest: [this.createBeforeRequestHook()],
        afterResponse: [this.createAfterResponseHook()],
      },
    });
  }

  /**
   * Create beforeRequest hook for authentication token injection
   */
  private createBeforeRequestHook(): BeforeRequestHook {
    return async (request) => {
      if (this.tokenGetter) {
        const token = await this.tokenGetter();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    };
  }

  /**
   * Create afterResponse hook for error handling
   */
  private createAfterResponseHook(): AfterResponseHook {
    return async (_request, _options, response) => {
      if (response.status === 401) {
        console.error('Unauthorized access');
      }
      return response;
    };
  }

  /**
   * Set a function to get the authentication token
   */
  setTokenGetter(getter: () => Promise<string | null>): void {
    this.tokenGetter = getter;
  }

  /**
   * Convert data and response to HttpClientResponse format
   */
  private createResponse<T>(data: T, response: Response): HttpClientResponse<T> {
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  /**
   * Proxy method to intercept HTTP calls
   */
  private async makeRequest<T>(
    method: HttpMethod,
    url: string,
    options?: HttpClientRequestOptions & { json?: unknown },
  ): Promise<HttpClientResponse<T>> {
    const kyOptions: Parameters<KyInstance>[1] = {
      headers: options?.headers,
      searchParams: options?.searchParams,
      timeout: options?.timeout,
      retry: options?.retry,
    };

    if (options?.json !== undefined && (method === 'post' || method === 'put' || method === 'patch')) {
      kyOptions.json = options.json;
    }

    // Store response metadata in closure for this request
    let responseMetadata: Response | null = null;

    // Create a request-specific Ky instance to capture response metadata
    // This is necessary because Ky returns parsed JSON, not Response objects
    const requestKy = ky.create({
      prefixUrl: this.config.baseURL ?? '',
      timeout: this.config.timeout ?? 10000,
      retry: {
        limit: this.config.retry?.limit ?? 2,
        methods: this.config.retry?.methods ?? ['get', 'put', 'head', 'delete', 'options', 'trace'],
        statusCodes: this.config.retry?.statusCodes ?? [408, 429, 500, 502, 503, 504],
      },
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
      hooks: {
        beforeRequest: [this.createBeforeRequestHook()],
        afterResponse: [
          async (_request, _options, response) => {
            // Clone response to store metadata (response body is consumed by Ky)
            responseMetadata = response.clone();
            if (response.status === 401) {
              console.error('Unauthorized access');
            }
            return response;
          },
        ],
      },
    });

    try {
      const data = (await requestKy[method](url, kyOptions)) as T;

      // Use captured response metadata or create fallback
      if (!responseMetadata) {
        responseMetadata = new Response(JSON.stringify(data), {
          status: 200,
          statusText: 'OK',
          headers: new Headers({ 'Content-Type': 'application/json' }),
        });
      }

      return this.createResponse<T>(data, responseMetadata);
    } catch (error) {
      // Handle HTTP errors - Ky throws HTTPError for non-2xx responses
      if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as { response: Response };
        let errorData: unknown = {};
        try {
          const text = await httpError.response.text();
          errorData = text ? JSON.parse(text) : {};
        } catch {
          // Ignore JSON parse errors, use empty object
        }
        throw {
          ...error,
          response: this.createResponse(errorData, httpError.response),
        };
      }
      throw error;
    }
  }

  async get<T = unknown>(url: string, options?: HttpClientRequestOptions): Promise<HttpClientResponse<T>> {
    return this.makeRequest<T>('get', url, options);
  }

  async post<T = unknown>(
    url: string,
    options?: HttpClientRequestOptions & { json?: unknown },
  ): Promise<HttpClientResponse<T>> {
    return this.makeRequest<T>('post', url, options);
  }

  async put<T = unknown>(
    url: string,
    options?: HttpClientRequestOptions & { json?: unknown },
  ): Promise<HttpClientResponse<T>> {
    return this.makeRequest<T>('put', url, options);
  }

  async delete<T = unknown>(url: string, options?: HttpClientRequestOptions): Promise<HttpClientResponse<T>> {
    return this.makeRequest<T>('delete', url, options);
  }

  async patch<T = unknown>(
    url: string,
    options?: HttpClientRequestOptions & { json?: unknown },
  ): Promise<HttpClientResponse<T>> {
    return this.makeRequest<T>('patch', url, options);
  }
}
