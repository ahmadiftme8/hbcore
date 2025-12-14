import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { UnleashService } from './unleash.service';

/**
 * Global Unleash module - provides feature flag functionality
 * shared across all modules
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [UnleashService],
  exports: [UnleashService],
})
export class UnleashModule {}
