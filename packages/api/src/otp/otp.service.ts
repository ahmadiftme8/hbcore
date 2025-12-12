import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createHmac, randomInt, timingSafeEqual } from 'crypto';
import { ConfigService } from '@/config/config.service';
import { RedisService } from '@/redis/redis.service';

@Injectable()
export class OtpService {
  private readonly maxAttempts = 5;
  private readonly otpLength: number;
  private readonly otpExpiryMinutes: number;
  private readonly otpLockoutMinutes: number;
  private readonly otpHmacSecret: string;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    const config = this.configService.e;
    this.otpLength = config.OTP_LENGTH;
    this.otpExpiryMinutes = config.OTP_EXPIRY_MINUTES;
    this.otpLockoutMinutes = config.OTP_LOCKOUT_MINUTES;
    this.otpHmacSecret =
      config.OTP_HMAC_SECRET && config.OTP_HMAC_SECRET.trim().length > 0 ? config.OTP_HMAC_SECRET : config.JWT_SECRET;
  }

  /**
   * Generate a numeric OTP code using a cryptographically secure RNG
   */
  private generateOTPCode(): string {
    const min = 10 ** (this.otpLength - 1);
    const maxExclusive = 10 ** this.otpLength;
    const code = randomInt(min, maxExclusive);
    return String(code).padStart(this.otpLength, '0');
  }

  private hashOTP(phone: string, code: string): string {
    const payload = `${phone}:${code}`;
    return createHmac('sha256', this.otpHmacSecret).update(payload).digest('hex');
  }

  private isHashEqual(storedHashHex: string, candidateHashHex: string): boolean {
    const stored = Buffer.from(storedHashHex, 'hex');
    const candidate = Buffer.from(candidateHashHex, 'hex');
    if (stored.length !== candidate.length) {
      return false;
    }
    return timingSafeEqual(stored, candidate);
  }

  private async assertNotLocked(phone: string): Promise<void> {
    const lockKey = this.getOTPLockKey(phone);
    const isLocked = await this.redisService.exists(lockKey);
    if (isLocked) {
      throw new BadRequestException('Too many failed OTP attempts. Please try again later.');
    }
  }

  /**
   * Generate and store OTP for a phone number
   * @param phone - Phone number in E.164 format
   * @returns The generated OTP code
   * @throws BadRequestException if Redis is unavailable
   */
  async generateOTP(phone: string): Promise<string> {
    await this.assertNotLocked(phone);

    const code = this.generateOTPCode();
    const otpHash = this.hashOTP(phone, code);

    const hashKey = this.getOTPHashKey(phone);
    const attemptsKey = this.getOTPAttemptsKey(phone);
    const ttlSeconds = this.otpExpiryMinutes * 60;

    const success = await this.redisService.set(hashKey, otpHash, ttlSeconds);
    if (!success) {
      throw new BadRequestException('Unable to generate OTP. Please try again later.');
    }

    // Reset attempts for the new OTP (best-effort)
    await this.redisService.del(attemptsKey);

    return code;
  }

  /**
   * Verify OTP code for a phone number
   * @param phone - Phone number in E.164 format
   * @param code - OTP code to verify
   * @returns true if valid, false otherwise
   * @throws BadRequestException if max attempts exceeded or OTP expired
   * @throws BadRequestException if Redis is unavailable
   */
  async verifyOTP(phone: string, code: string): Promise<boolean> {
    await this.assertNotLocked(phone);

    const normalizedCode = code.trim();
    const hashKey = this.getOTPHashKey(phone);
    const attemptsKey = this.getOTPAttemptsKey(phone);

    const storedHash = await this.redisService.get(hashKey);
    if (!storedHash) {
      throw new NotFoundException('OTP not found or expired. Please request a new OTP.');
    }

    try {
      // Increment attempts atomically
      const attempts = await this.redisService.incr(attemptsKey);
      if (attempts === 0) {
        throw new BadRequestException('Unable to verify OTP. Please try again later.');
      }

      // Align attempts TTL to OTP TTL (best-effort, only needed on first attempt)
      if (attempts === 1) {
        const remainingTtl = await this.redisService.ttl(hashKey);
        if (remainingTtl === -2) {
          throw new NotFoundException('OTP not found or expired. Please request a new OTP.');
        }
        const ttlToUse = remainingTtl > 0 ? remainingTtl : this.otpExpiryMinutes * 60;
        await this.redisService.expire(attemptsKey, ttlToUse);
      }

      // Enforce max attempts with a cooldown lockout
      if (attempts > this.maxAttempts) {
        const lockKey = this.getOTPLockKey(phone);
        const lockTtlSeconds = this.otpLockoutMinutes * 60;
        await this.redisService.set(lockKey, '1', lockTtlSeconds);
        throw new BadRequestException('Maximum verification attempts exceeded. Please try again later.');
      }

      const candidateHash = this.hashOTP(phone, normalizedCode);
      if (!this.isHashEqual(storedHash, candidateHash)) {
        return false;
      }

      // Code is valid - invalidate OTP
      await this.invalidateOTP(phone);
      return true;
    } catch (error) {
      // Re-throw BadRequestException and NotFoundException as-is
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      // For other errors (like Redis failures), throw a user-friendly error
      throw new BadRequestException('Unable to verify OTP. Please try again later.');
    }
  }

  /**
   * Invalidate OTP for a phone number (after successful verification)
   * @param phone - Phone number in E.164 format
   */
  async invalidateOTP(phone: string): Promise<void> {
    const hashKey = this.getOTPHashKey(phone);
    const attemptsKey = this.getOTPAttemptsKey(phone);
    await Promise.all([this.redisService.del(hashKey), this.redisService.del(attemptsKey)]);
  }

  /**
   * Get remaining attempts for an OTP
   * @param phone - Phone number in E.164 format
   */
  async getRemainingAttempts(phone: string): Promise<number> {
    const hashKey = this.getOTPHashKey(phone);
    const storedHash = await this.redisService.get(hashKey);
    if (!storedHash) {
      return 0;
    }

    const attemptsKey = this.getOTPAttemptsKey(phone);
    const attemptsStr = await this.redisService.get(attemptsKey);
    const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;
    return Math.max(0, this.maxAttempts - attempts);
  }

  /**
   * Generate Redis keys for OTP storage
   */
  private getOTPHashKey(phone: string): string {
    return `otp:hash:${phone}`;
  }

  private getOTPAttemptsKey(phone: string): string {
    return `otp:attempts:${phone}`;
  }

  private getOTPLockKey(phone: string): string {
    return `otp:lock:${phone}`;
  }
}
