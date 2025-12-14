import { SetMetadata } from '@nestjs/common';

export const FEATURE_FLAG_KEY = 'featureFlag';

/**
 * Decorator to mark a controller method or service method as requiring a feature flag
 * Usage: @FeatureFlag('my-feature-flag')
 *
 * Should be used with FeatureFlagGuard or checked manually in the method
 */
export const FeatureFlag = (flagName: string) => SetMetadata(FEATURE_FLAG_KEY, flagName);
