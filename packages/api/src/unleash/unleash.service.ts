import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Unleash, type UnleashConfig } from 'unleash-client';
import { ConfigService } from '@/config/config.service';

@Injectable()
export class UnleashService implements OnModuleInit, OnModuleDestroy {
  private client: Unleash | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const config = this.configService.e;

    const unleashConfig: UnleashConfig = {
      url: config.UNLEASH_URL,
      appName: config.UNLEASH_APP_NAME,
      environment: config.NODE_ENV,
      refreshInterval: config.UNLEASH_REFRESH_INTERVAL,
      metricsInterval: config.UNLEASH_METRICS_INTERVAL,
      ...(config.UNLEASH_API_TOKEN && {
        customHeaders: {
          Authorization: config.UNLEASH_API_TOKEN,
        },
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

  onModuleDestroy() {
    if (this.client) {
      this.client.destroy();
    }
  }

  /**
   * Check if a feature flag is enabled
   * @param flagName - Name of the feature flag
   * @param context - Optional context for targeting (userId, sessionId, etc.)
   * @returns true if feature is enabled, false otherwise
   */
  isEnabled(flagName: string, context?: Record<string, string>): boolean {
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
  getVariant(flagName: string, context?: Record<string, string>) {
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
}
