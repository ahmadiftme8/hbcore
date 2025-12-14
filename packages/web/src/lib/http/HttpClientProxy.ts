import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { logger } from '../utils/logger';
import { handleHttpError } from './error-handler';
import type { IHttpClient } from './HttpClient.interface';
import type { HttpClientConfig, HttpClientRequestOptions, HttpClientResponse, HttpMethod } from './types';

/**
 * HTTP Client Proxy Implementation
 * Uses Proxy pattern to intercept HTTP method calls and add cross-cutting concerns
 */
export class HttpClientProxy implements IHttpClient {
  private axiosInstance: AxiosInstance;
  private tokenGetter?: () => Promise<string | null>;
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig = {}) {
    this.config = config;

    const retryConfig = {
      limit: config.retry?.limit ?? 2,
      methods: config.retry?.methods ?? ['get', 'put', 'head', 'delete', 'options', 'trace'],
      statusCodes: config.retry?.statusCodes ?? [408, 429, 500, 502, 503, 504],
    };

    this.axiosInstance = axios.create({
      baseURL: config.baseURL ?? '',
      timeout: config.timeout ?? 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Configure retry logic using axios-retry
    axiosRetry(this.axiosInstance, {
      retries: retryConfig.limit,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        if (!error.response) {
          // Retry on network errors
          return true;
        }
        // Retry on specific status codes
        return retryConfig.statusCodes.includes(error.response.status);
      },
      onRetry: (retryCount, error) => {
        logger.info(`🔄 Retrying request (attempt ${retryCount + 1}/${retryConfig.limit + 1})`, {
          url: error.config?.url,
          method: error.config?.method,
        });
      },
    });

    // Set up request interceptor for authentication token injection
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        logger.info('🔧 Request interceptor called', {
          url: config.url,
          method: config.method,
          headersCount: Object.keys(config.headers).length,
        });

        if (this.tokenGetter) {
          try {
            const token = await this.tokenGetter();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
              logger.info('✅ Auth token added to request headers');
            } else {
              logger.info('ℹ️ No auth token available');
            }
          } catch (error) {
            logger.error('❌ Failed to get auth token:', error);
          }
        }

        // Log request headers (excluding sensitive data)
        const headers: Record<string, string> = {};
        Object.entries(config.headers).forEach(([key, value]) => {
          if (key.toLowerCase() === 'authorization') {
            headers[key] = 'Bearer ***';
          } else if (typeof value === 'string') {
            headers[key] = value;
          }
        });
        logger.info('📋 Request headers:', headers);

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Set up response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (response.status === 401) {
          logger.error('Unauthorized access');
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  /**
   * Set a function to get the authentication token
   */
  setTokenGetter(getter: () => Promise<string | null>): void {
    this.tokenGetter = getter;
  }

  /**
   * Convert axios response to HttpClientResponse format
   */
  private createResponse<T>(axiosResponse: AxiosResponse<T>): HttpClientResponse<T> {
    return {
      data: axiosResponse.data,
      status: axiosResponse.status,
      statusText: axiosResponse.statusText,
      headers: axiosResponse.headers as unknown as Headers,
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
    const normalizedUrl = url.startsWith('/') ? url.slice(1) : url;
    const normalizedBaseURL = this.config.baseURL?.replace(/\/$/, '') ?? '';
    const fullUrl = `${normalizedBaseURL}/${normalizedUrl}`;

    // Log request initiation
    logger.info(`🚀 Initiating ${method.toUpperCase()} request`, {
      fullUrl,
      baseURL: normalizedBaseURL,
      url: normalizedUrl,
      hasJson: options?.json !== undefined,
      hasHeaders: !!options?.headers,
      hasSearchParams: !!options?.searchParams,
      timeout: options?.timeout ?? this.config.timeout,
    });

    const axiosConfig: AxiosRequestConfig = {
      method,
      url: normalizedUrl,
      headers: options?.headers,
      params: options?.searchParams,
      timeout: options?.timeout,
    };

    if (options?.json !== undefined && (method === 'post' || method === 'put' || method === 'patch')) {
      axiosConfig.data = options.json;
      // Log request body (be careful with sensitive data)
      logger.info('📦 Request body:', {
        hasData: true,
        dataType: typeof options.json,
        isArray: Array.isArray(options.json),
      });
    }

    // Log full request configuration
    logger.info('⚙️ Request configuration:', {
      method: method.toUpperCase(),
      url: normalizedUrl,
      baseURL: normalizedBaseURL,
      fullUrl,
      hasHeaders: !!axiosConfig.headers,
      hasSearchParams: !!axiosConfig.params,
      timeout: axiosConfig.timeout,
    });

    try {
      logger.info(`🌐 Sending ${method.toUpperCase()} request to Axios...`);
      const response = await this.axiosInstance.request<T>(axiosConfig);
      logger.info(`✅ ${method.toUpperCase()} request successful`, {
        url: fullUrl,
        hasData: response.data !== undefined,
        dataType: typeof response.data,
      });

      return this.createResponse<T>(response);
    } catch (error) {
      // Extract detailed error information - ensure we always have useful data
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorName = error instanceof Error ? error.name : typeof error;
      
      const errorDetails: Record<string, unknown> = {
        url: fullUrl,
        method: method.toUpperCase(),
        errorName,
        errorMessage,
      };

      // Add Error instance details
      if (error instanceof Error) {
        if (error.stack) {
          errorDetails.errorStack = error.stack;
        }
        if ('cause' in error && error.cause) {
          errorDetails.errorCause = error.cause;
        }
      } else {
        // For non-Error objects, try to stringify
        try {
          errorDetails.errorValue = JSON.stringify(error);
        } catch {
          errorDetails.errorValue = String(error);
        }
      }

      // Add axios-specific error details
      if (axios.isAxiosError(error)) {
        errorDetails.axiosError = true;
        if (error.code) {
          errorDetails.errorCode = error.code;
        }
        if (error.response) {
          errorDetails.responseStatus = error.response.status;
          errorDetails.responseStatusText = error.response.statusText;
          errorDetails.responseData = error.response.data;
        } else if (error.request) {
          errorDetails.hasRequest = true;
          errorDetails.noResponse = true;
          // Include request details if available
          if (error.config) {
            errorDetails.requestUrl = error.config.url;
            errorDetails.requestMethod = error.config.method;
            errorDetails.requestBaseURL = error.config.baseURL;
          }
        }
        // Axios errors have a message property
        if (error.message && error.message !== errorMessage) {
          errorDetails.axiosMessage = error.message;
        }
      }

      // Log error with clear message first
      logger.error(`❌ ${method.toUpperCase()} request failed to ${fullUrl}`);
      logger.error(`Error: ${errorName} - ${errorMessage}`);
      logger.error(`Details:`, errorDetails);
      // Use centralized error handler
      await handleHttpError(error, method, normalizedUrl, normalizedBaseURL);
      // This will never be reached, but TypeScript needs it
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
