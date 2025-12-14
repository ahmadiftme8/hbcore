import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FEATURE_FLAG_KEY } from '../decorators/feature-flag.decorator';
import { FeatureFlag } from '../feature-flags.enum';
import { UnleashService } from '../unleash.service';

/**
 * Guard that checks feature flags before allowing access to controller methods
 * Returns 403 Forbidden if feature flag is disabled
 */
@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private readonly unleashService: UnleashService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const flagName = this.reflector.getAllAndOverride<FeatureFlag>(FEATURE_FLAG_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!flagName) {
      // No feature flag required, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Build context for Unleash (can include userId, sessionId, etc.)
    const unleashContext: Record<string, string> = {};
    if (request.user?.id) {
      unleashContext.userId = String(request.user.id);
    }
    if (request.sessionId) {
      unleashContext.sessionId = request.sessionId;
    }

    const isEnabled = this.unleashService.isEnabled(flagName, unleashContext);

    if (!isEnabled) {
      throw new ForbiddenException(`Feature flag "${flagName}" is not enabled`);
    }

    return true;
  }
}
