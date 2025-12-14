import type { FeatureFlag, UnleashClientConfig } from '@hbcore/types';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { UnleashClient } from './unleash-client';

@Injectable()
export class UnleashService implements OnModuleInit, OnModuleDestroy {
  private readonly unleashClient: UnleashClient;

  constructor(private readonly configService: ConfigService) {
    this.unleashClient = new UnleashClient();
  }

  async onModuleInit() {
    const config = this.configService.e;

    const unleashConfig: UnleashClientConfig = {
      url: config.UNLEASH_URL,
      appName: config.UNLEASH_APP_NAME,
      environment: config.NODE_ENV,
      refreshInterval: config.UNLEASH_REFRESH_INTERVAL,
      metricsInterval: config.UNLEASH_METRICS_INTERVAL,
      ...(config.UNLEASH_BACKEND_API_TOKEN && {
        customHeaders: {
          Authorization: config.UNLEASH_BACKEND_API_TOKEN,
        },
      }),
    };

    await this.unleashClient.init(unleashConfig);
  }

  onModuleDestroy() {
    this.unleashClient.destroy();
  }

  /**
   * Check if a feature flag is enabled
   * @param flagName - Name of the feature flag
   * @param context - Optional context for targeting (userId, sessionId, etc.)
   * @returns true if feature is enabled, false otherwise
   */
  isEnabled(flagName: FeatureFlag, context?: Record<string, string>): boolean {
    return this.unleashClient.isEnabled(flagName, context);
  }

  /**
   * Get variant of a feature flag
   * @param flagName - Name of the feature flag
   * @param context - Optional context for targeting
   * @returns Variant object
   */
  getVariant(flagName: FeatureFlag, context?: Record<string, string>) {
    return this.unleashClient.getVariant(flagName, context);
  }
}
