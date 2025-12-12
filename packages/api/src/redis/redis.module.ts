import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { RedisService } from './redis.service';

/**
 * Global Redis module - provides a single Redis connection instance
 * shared across all modules that need Redis functionality
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
