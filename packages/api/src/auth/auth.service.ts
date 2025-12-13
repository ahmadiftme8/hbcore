import type { AuthResult } from '@hbcore/types';
import { ProviderUidSchema } from '@hbcore/types';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@/config/config.service';
import { FingerprintingService } from '@/fingerprinting/fingerprinting.service';
import { OtpService } from '@/otp/otp.service';
import { PhoneValidationService } from '@/phone-validation/phone-validation.service';
import { RateLimitingService } from '@/rate-limiting/rate-limiting.service';
import type { SmsStrategy } from '@/sms/sms-strategy.interface';
import { TurnstileService } from '@/turnstile/turnstile.service';
import { UsersService } from '@/users/users.service';
import { FirebaseStrategy } from './strategies/firebase.strategy';
import { PhoneStrategy } from './strategies/phone.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseStrategy: FirebaseStrategy,
    private readonly phoneStrategy: PhoneStrategy,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    @Inject('SmsStrategy') private readonly smsStrategy: SmsStrategy,
    private readonly phoneValidationService: PhoneValidationService,
    private readonly rateLimitingService: RateLimitingService,
    private readonly turnstileService: TurnstileService,
    private readonly fingerprintingService: FingerprintingService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Authenticate with Firebase
   * @param idToken - Firebase ID token
   * @returns Authentication result
   * @deprecated Google/Firebase authentication is disabled
   */
  // async authenticateWithFirebase(idToken: string): Promise<AuthResult> {
  //   return this.firebaseStrategy.authenticate(idToken);
  // }

  /**
   * Request OTP for phone authentication
   * @param phone - Phone number
   * @param turnstileToken - Cloudflare Turnstile token
   * @param fingerprint - Request fingerprint
   * @param ip - Client IP address
   */
  async requestOTP(phone: string, turnstileToken: string, fingerprint: string, ip: string): Promise<void> {
    // Validate phone number
    const validatedPhone = this.phoneValidationService.validatePhone(phone);

    // Verify Turnstile token
    await this.turnstileService.verifyToken(turnstileToken, ip);

    // Check rate limits (per IP and per phone)
    // Intentionally after Turnstile verification so invalid Turnstile tokens don't burn rate-limit quotas.
    await this.rateLimitingService.checkOTPRateLimit(ip, validatedPhone);

    // Check if fingerprint is suspicious
    const isSuspicious = await this.fingerprintingService.isSuspicious(fingerprint);
    if (isSuspicious) {
      // Mark as suspicious but don't block (for monitoring)
      await this.fingerprintingService.markSuspicious(fingerprint);
    }

    // Generate OTP
    const otpCode = await this.otpService.generateOTP(validatedPhone);

    // TODO: Remove this temporary logger after development
    console.log(`\n🔐 OTP Generated for ${validatedPhone}: ${otpCode}\n`);

    // Send SMS (mock implementation) - disabled for now
    // const message = `Your verification code is: ${otpCode}`;
    // await this.smsStrategy.sendSMS(validatedPhone, message);
  }

  /**
   * Verify OTP and authenticate user
   * @param phone - Phone number
   * @param code - OTP code
   * @returns Authentication result with user and JWT token
   */
  async verifyOTP(phone: string, code: string): Promise<AuthResult & { token: string }> {
    // Validate phone number
    const validatedPhone = this.phoneValidationService.validatePhone(phone);

    // Verify OTP
    const isValid = await this.otpService.verifyOTP(validatedPhone, code);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP code');
    }

    // Find or create user by phone
    const user = await this.usersService.findOrCreateByPhone(validatedPhone, {});

    // Create or update phone credential
    await this.usersService.upsertPhoneCredential(user.id, validatedPhone);

    // Generate JWT token
    const config = this.configService.e;
    const token = jwt.sign(
      {
        phone: validatedPhone,
        userId: user.id,
      },
      config.JWT_SECRET,
      {
        expiresIn: `${config.JWT_EXPIRY_HOURS}h`,
      },
    );

    return {
      user,
      providerUid: ProviderUidSchema.parse(validatedPhone),
      token,
    };
  }

  /**
   * Authenticate with phone JWT token
   * @param idToken - JWT token from phone authentication
   * @returns Authentication result
   */
  async authenticateWithPhone(idToken: string): Promise<AuthResult> {
    return this.phoneStrategy.authenticate(idToken);
  }
}
