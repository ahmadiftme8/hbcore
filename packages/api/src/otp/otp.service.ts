import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { RedisService } from '@/redis/redis.service';

interface OTPData {
  code: string;
  attempts: number;
  createdAt: number;
}

@Injectable()
export class OtpService {
  private readonly maxAttempts = 5;
  private readonly otpLength: number;
  private readonly otpExpiryMinutes: number;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.otpLength = this.configService.e.OTP_LENGTH;
    this.otpExpiryMinutes = this.configService.e.OTP_EXPIRY_MINUTES;
  }

  /**
   * Generate a 6-digit OTP code
   */
  private generateOTPCode(): string {
    const min = 10 ** (this.otpLength - 1);
    const max = 10 ** this.otpLength - 1;
    const code = Math.floor(Math.random() * (max - min + 1)) + min;
    return code.toString().padStart(this.otpLength, '0');
  }

  /**
   * Generate and store OTP for a phone number
   * @param phone - Phone number in E.164 format
   * @returns The generated OTP code
   * @throws BadRequestException if Redis is unavailable
   */
  async generateOTP(phone: string): Promise<string> {
    const code = this.generateOTPCode();
    const otpData: OTPData = {
      code,
      attempts: 0,
      createdAt: Date.now(),
    };

    const key = this.getOTPKey(phone);
    const ttlSeconds = this.otpExpiryMinutes * 60;

    const success = await this.redisService.set(key, JSON.stringify(otpData), ttlSeconds);
    if (!success) {
      throw new BadRequestException('Unable to generate OTP. Please try again later.');
    }

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
    const key = this.getOTPKey(phone);
    const stored = await this.redisService.get(key);

    if (!stored) {
      throw new NotFoundException('OTP not found or expired. Please request a new OTP.');
    }

    try {
      const otpData: OTPData = JSON.parse(stored);

      // Check if max attempts exceeded
      if (otpData.attempts >= this.maxAttempts) {
        await this.redisService.del(key);
        throw new BadRequestException('Maximum verification attempts exceeded. Please request a new OTP.');
      }

      // Get remaining TTL to preserve expiration time
      const remainingTtl = await this.redisService.ttl(key);

      // If TTL is -2, key was deleted between get and ttl check
      if (remainingTtl === -2) {
        throw new NotFoundException('OTP not found or expired. Please request a new OTP.');
      }

      // Increment attempts atomically
      // Use remaining TTL if available, otherwise use default expiry
      const ttlToUse = remainingTtl > 0 ? remainingTtl : this.otpExpiryMinutes * 60;
      otpData.attempts += 1;
      const setSuccess = await this.redisService.set(key, JSON.stringify(otpData), ttlToUse);
      if (!setSuccess) {
        throw new BadRequestException('Unable to verify OTP. Please try again later.');
      }

      // Verify code
      if (otpData.code !== code) {
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
    const key = this.getOTPKey(phone);
    await this.redisService.del(key);
  }

  /**
   * Get remaining attempts for an OTP
   * @param phone - Phone number in E.164 format
   */
  async getRemainingAttempts(phone: string): Promise<number> {
    const key = this.getOTPKey(phone);
    const stored = await this.redisService.get(key);

    if (!stored) {
      return 0;
    }

    const otpData: OTPData = JSON.parse(stored);
    return Math.max(0, this.maxAttempts - otpData.attempts);
  }

  /**
   * Generate Redis key for OTP storage
   */
  private getOTPKey(phone: string): string {
    return `otp:${phone}`;
  }
}
