import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { RedisModule } from '@/redis/redis.module';
import { OtpService } from './otp.service';

@Module({
  imports: [ConfigModule, RedisModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
