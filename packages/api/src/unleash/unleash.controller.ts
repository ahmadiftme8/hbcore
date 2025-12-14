import { FeatureFlag } from '@hbcore/types';
import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { UnleashService } from './unleash.service';

/**
 * Controller for feature flag endpoints
 */
@Controller('feature-flags')
export class UnleashController {
  constructor(private readonly unleashService: UnleashService) {}

  /**
   * Check if a feature flag is enabled
   * @param flagName - The name of the feature flag to check
   * @returns { enabled: boolean }
   */
  @Get(':flagName')
  getFeatureFlag(@Param('flagName') flagName: string): { enabled: boolean } {
    // Validate flagName against FeatureFlag enum
    const validFlags = Object.values(FeatureFlag) as string[];
    
    if (!validFlags.includes(flagName)) {
      throw new BadRequestException(
        `Invalid feature flag: "${flagName}". Valid flags are: ${validFlags.join(', ')}`,
      );
    }

    const enabled = this.unleashService.isEnabled(flagName as FeatureFlag);
    
    return { enabled };
  }
}

