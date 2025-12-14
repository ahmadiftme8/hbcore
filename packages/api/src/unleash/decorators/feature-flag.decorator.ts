import { SetMetadata } from '@nestjs/common';
import { FeatureFlag } from '../feature-flags.enum';

export const FEATURE_FLAG_KEY = 'featureFlag';

/**
 * Decorator to mark a controller method or service method as requiring a feature flag
 * Usage: @RequireFeatureFlag(FeatureFlag.PING_PONG)
 *
 * Should be used with FeatureFlagGuard or checked manually in the method
 */
export const RequireFeatureFlag = (flagName: FeatureFlag) => SetMetadata(FEATURE_FLAG_KEY, flagName);
