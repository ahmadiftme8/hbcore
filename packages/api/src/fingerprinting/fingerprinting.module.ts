import { Module } from '@nestjs/common';
import { RedisModule } from '@/redis/redis.module';
import { FingerprintingService } from './fingerprinting.service';

@Module({
  imports: [RedisModule],
  providers: [FingerprintingService],
  exports: [FingerprintingService],
})
export class FingerprintingModule {}
