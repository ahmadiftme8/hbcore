import { Module } from '@nestjs/common';
import { ConfigModule } from '@/config/config.module';
import { FingerprintingModule } from '@/fingerprinting/fingerprinting.module';
import { FirebaseModule } from '@/firebase/firebase.module';
import { OtpModule } from '@/otp/otp.module';
import { PhoneValidationModule } from '@/phone-validation/phone-validation.module';
import { RateLimitingModule } from '@/rate-limiting/rate-limiting.module';
import { RedisModule } from '@/redis/redis.module';
import { SmsModule } from '@/sms/sms.module';
import { TurnstileModule } from '@/turnstile/turnstile.module';
import { UsersModule } from '@/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PhoneAuthGuard } from './guards/phone-auth.guard';
import { FirebaseStrategy } from './strategies/firebase.strategy';
import { PhoneStrategy } from './strategies/phone.strategy';

@Module({
  imports: [
    ConfigModule,
    FirebaseModule,
    UsersModule,
    RedisModule,
    OtpModule,
    SmsModule,
    TurnstileModule,
    RateLimitingModule,
    PhoneValidationModule,
    FingerprintingModule,
  ],
  providers: [AuthService, FirebaseStrategy, PhoneStrategy, PhoneAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, PhoneAuthGuard],
})
export class AuthModule {}
