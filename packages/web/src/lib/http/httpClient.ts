import type { IHttpClient } from './HttpClient.interface';
import { HttpClientProxy } from './HttpClientProxy';
import type { HttpClientConfig } from './types';

/**
 * Create a configured HTTP client instance
 */
export function createHttpClient(config?: HttpClientConfig): IHttpClient {
  return new HttpClientProxy(config);
}

/**
 * Default HTTP client instance
 * Can be configured via environment variables or passed config
 */
const defaultConfig: HttpClientConfig = {
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
    statusCodes: [408, 429, 500, 502, 503, 504],
  },
};

export const httpClient = createHttpClient(defaultConfig);
