import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { FeatureFlagGuard } from './guards/feature-flag.guard';
import { UnleashService } from './unleash.service';

/**
 * Global Unleash module - provides feature flag functionality
 * shared across all modules
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [UnleashService, FeatureFlagGuard],
  exports: [UnleashService, FeatureFlagGuard],
})
export class UnleashModule {}
