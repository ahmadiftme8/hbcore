import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from '@/redis/redis.service';

export enum RateLimitType {
  IP = 'ip',
  PHONE = 'phone',
}

@Injectable()
export class RateLimitingService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Check if a rate limit has been exceeded
   * @param identifier - IP address or phone number
   * @param type - Type of rate limit (IP or PHONE)
   * @param limit - Maximum number of requests allowed
   * @param windowSeconds - Time window in seconds
   * @returns true if rate limit is exceeded, false otherwise
   * @note If Redis is unavailable, returns false (fail open) to maintain service availability
   */
  async checkRateLimit(
    identifier: string,
    type: RateLimitType,
    limit: number,
    windowSeconds: number,
  ): Promise<boolean> {
    try {
      const key = this.getKey(identifier, type);

      // Get current count first
      const current = await this.getCount(identifier, type);

      // If already at or above limit, return true
      if (current >= limit) {
        return true;
      }

      // Increment atomically
      const newCount = await this.redisService.incr(key);

      // Set expiration on first request (when count becomes 1)
      if (newCount === 1) {
        await this.redisService.expire(key, windowSeconds);
      }

      // Check if the increment pushed us over the limit
      return newCount > limit;
    } catch (error) {
      // If Redis fails, fail open (allow request) to maintain service availability
      // Log warning for monitoring
      console.warn(
        `Rate limit check failed for ${type}:${identifier}, allowing request (fail open):`,
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  /**
   * Increment the counter for a rate limit
   * @param identifier - IP address or phone number
   * @param type - Type of rate limit (IP or PHONE)
   * @note Silently fails if Redis is unavailable (non-critical operation)
   */
  async incrementCounter(identifier: string, type: RateLimitType): Promise<void> {
    try {
      const key = this.getKey(identifier, type);
      await this.redisService.incr(key);
    } catch (error) {
      // Silently fail - this is a non-critical operation
      // Rate limiting will still work, just won't track this increment
      console.warn(
        `Rate limit increment failed for ${type}:${identifier}:`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Get the current count for a rate limit
   * @param identifier - IP address or phone number
   * @param type - Type of rate limit (IP or PHONE)
   * @returns The current count, or 0 if Redis is unavailable
   */
  async getCount(identifier: string, type: RateLimitType): Promise<number> {
    try {
      const key = this.getKey(identifier, type);
      const value = await this.redisService.get(key);
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      // If Redis fails, return 0 (no count) to allow requests
      console.warn(
        `Rate limit getCount failed for ${type}:${identifier}:`,
        error instanceof Error ? error.message : String(error),
      );
      return 0;
    }
  }

  /**
   * Reset a rate limit counter
   * @param identifier - IP address or phone number
   * @param type - Type of rate limit (IP or PHONE)
   */
  async reset(identifier: string, type: RateLimitType): Promise<void> {
    const key = this.getKey(identifier, type);
    await this.redisService.del(key);
  }

  /**
   * Get remaining attempts before rate limit
   * @param identifier - IP address or phone number
   * @param type - Type of rate limit (IP or PHONE)
   * @param limit - Maximum number of requests allowed
   */
  async getRemaining(identifier: string, type: RateLimitType, limit: number): Promise<number> {
    const current = await this.getCount(identifier, type);
    return Math.max(0, limit - current);
  }

  /**
   * Generate Redis key for rate limiting
   */
  private getKey(identifier: string, type: RateLimitType): string {
    return `rate_limit:${type}:${identifier}`;
  }

  /**
   * Check OTP request rate limits (per IP and per phone)
   * @param ip - IP address
   * @param phone - Phone number
   * @throws BadRequestException if rate limit exceeded
   */
  async checkOTPRateLimit(ip: string, phone: string): Promise<void> {
    // Per IP: max 5 OTP requests per hour
    const ipExceeded = await this.checkRateLimit(ip, RateLimitType.IP, 5, 3600);
    if (ipExceeded) {
      throw new BadRequestException('Too many OTP requests from this IP. Please try again later.');
    }

    // Per phone: max 3 OTP requests per hour
    const phoneExceeded = await this.checkRateLimit(phone, RateLimitType.PHONE, 3, 3600);
    if (phoneExceeded) {
      throw new BadRequestException('Too many OTP requests for this phone number. Please try again later.');
    }
  }
}
