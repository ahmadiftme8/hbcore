import { Module } from '@nestjs/common';
import { RedisModule } from '@/redis/redis.module';
import { RateLimitingService } from './rate-limiting.service';

@Module({
  imports: [RedisModule],
  providers: [RateLimitingService],
  exports: [RateLimitingService],
})
export class RateLimitingModule {}
