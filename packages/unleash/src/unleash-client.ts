import type { FeatureFlag } from '@hbcore/types';
import { Unleash, type UnleashConfig, type Variant } from 'unleash-client';
import type { UnleashClientConfig, UnleashContext } from './types';

/**
 * Framework-agnostic Unleash client wrapper
 * Handles initialization, lifecycle, and feature flag evaluation
 */
export class UnleashClient {
  private client: Unleash | null = null;
  private initialized = false;

  /**
   * Initialize the Unleash client
   * @param config - Configuration for Unleash client
   * @throws Error if initialization fails or times out
   */
  async init(config: UnleashClientConfig): Promise<void> {
    if (this.initialized) {
      console.warn('Unleash client already initialized');
      return;
    }

    const unleashConfig: UnleashConfig = {
      url: config.url,
      appName: config.appName,
      environment: config.environment,
      refreshInterval: config.refreshInterval,
      metricsInterval: config.metricsInterval,
      ...(config.customHeaders && {
        customHeaders: config.customHeaders,
      }),
    };

    this.client = new Unleash(unleashConfig);

    // Wait for client to be ready
    await new Promise<void>((resolve, reject) => {
      if (!this.client) {
        reject(new Error('Unleash client not initialized'));
        return;
      }

      const timeout = setTimeout(() => {
        if (this.client) {
          this.client.removeListener('ready', onReady);
          this.client.removeListener('error', onError);
        }
        reject(new Error('Unleash connection timeout'));
      }, 10000); // 10 second timeout

      const onReady = () => {
        clearTimeout(timeout);
        if (this.client) {
          this.client.removeListener('error', onError);
        }
        this.initialized = true;
        resolve();
      };

      const onError = (error: Error) => {
        clearTimeout(timeout);
        if (this.client) {
          this.client.removeListener('ready', onReady);
        }
        reject(error);
      };

      this.client.once('ready', onReady);
      this.client.once('error', onError);
    });
  }

  /**
   * Destroy the Unleash client and cleanup resources
   */
  destroy(): void {
    if (this.client) {
      this.client.destroy();
      this.client = null;
      this.initialized = false;
    }
  }

  /**
   * Check if a feature flag is enabled
   * @param flagName - Name of the feature flag
   * @param context - Optional context for targeting (userId, sessionId, etc.)
   * @returns true if feature is enabled, false otherwise
   */
  isEnabled(flagName: FeatureFlag, context?: UnleashContext): boolean {
    if (!this.client) {
      console.warn('Unleash client not initialized, returning false');
      return false;
    }

    try {
      return this.client.isEnabled(flagName, context);
    } catch (error) {
      console.warn(`Error checking feature flag ${flagName}:`, error instanceof Error ? error.message : String(error));
      return false; // Fail closed - return false on error
    }
  }

  /**
   * Get variant of a feature flag
   * @param flagName - Name of the feature flag
   * @param context - Optional context for targeting
   * @returns Variant object
   */
  getVariant(flagName: FeatureFlag, context?: UnleashContext): Variant {
    if (!this.client) {
      return { enabled: false, name: 'disabled' };
    }

    try {
      return this.client.getVariant(flagName, context);
    } catch (error) {
      console.warn(`Error getting variant for ${flagName}:`, error instanceof Error ? error.message : String(error));
      return { enabled: false, name: 'disabled' };
    }
  }

  /**
   * Check if the client is initialized
   */
  get isInitialized(): boolean {
    return this.initialized && this.client !== null;
  }
}
