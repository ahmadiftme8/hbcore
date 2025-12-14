/**
 * Configuration for Unleash client initialization
 */
export interface UnleashClientConfig {
  url: string;
  appName: string;
  environment?: string;
  refreshInterval?: number;
  metricsInterval?: number;
  customHeaders?: Record<string, string>;
}

/**
 * Context for feature flag evaluation
 * Can include userId, sessionId, or other targeting properties
 */
export type UnleashContext = Record<string, string>;
