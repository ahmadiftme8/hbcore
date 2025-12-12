import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import type { Request } from 'express';
import { RedisService } from '@/redis/redis.service';

@Injectable()
export class FingerprintingService {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Generate a fingerprint from request metadata
   * @param request - Express request object
   * @returns Fingerprint hash string
   */
  generateFingerprint(request: Request): string {
    const ip = this.getClientIp(request);
    const userAgent = request.headers['user-agent'] || '';
    const acceptLanguage = request.headers['accept-language'] || '';
    const acceptEncoding = request.headers['accept-encoding'] || '';

    // Create a string from all fingerprint components
    const fingerprintData = `${ip}|${userAgent}|${acceptLanguage}|${acceptEncoding}`;

    // Generate SHA-256 hash
    const hash = createHash('sha256').update(fingerprintData).digest('hex');

    return hash;
  }

  /**
   * Check if a fingerprint is suspicious
   * @param fingerprint - Fingerprint hash to check
   * @returns true if suspicious, false otherwise
   * @note Returns false (not suspicious) if Redis is unavailable (fail open)
   */
  async isSuspicious(fingerprint: string): Promise<boolean> {
    try {
      const key = this.getSuspiciousKey(fingerprint);
      const count = await this.redisService.get(key);

      if (!count) {
        return false;
      }

      // If fingerprint has been flagged multiple times, it's suspicious
      const suspiciousThreshold = 3;
      return parseInt(count, 10) >= suspiciousThreshold;
    } catch (error) {
      // If Redis fails, return false (not suspicious) to allow requests
      console.warn(
        `Fingerprint check failed for ${fingerprint}, allowing request (fail open):`,
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }

  /**
   * Mark a fingerprint as suspicious
   * @param fingerprint - Fingerprint hash to mark
   * @param ttlSeconds - Time to live in seconds (default: 24 hours)
   * @note Silently fails if Redis is unavailable (non-critical operation)
   */
  async markSuspicious(fingerprint: string, ttlSeconds = 86400): Promise<void> {
    try {
      const key = this.getSuspiciousKey(fingerprint);
      const current = await this.redisService.incr(key);

      // Set expiration on first increment
      if (current === 1) {
        await this.redisService.expire(key, ttlSeconds);
      }
    } catch (error) {
      // Silently fail - this is a non-critical operation
      // Fingerprinting will still work, just won't track this mark
      console.warn(
        `Fingerprint markSuspicious failed for ${fingerprint}:`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Get client IP address from request
   * @param request - Express request object
   * @returns Client IP address
   */
  private getClientIp(request: Request): string {
    // Check for IP in various headers (for proxies/load balancers)
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
      return ips.trim();
    }

    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }

    // Fallback to connection remote address
    return request.socket.remoteAddress || 'unknown';
  }

  /**
   * Generate Redis key for suspicious fingerprint tracking
   */
  private getSuspiciousKey(fingerprint: string): string {
    return `fingerprint:suspicious:${fingerprint}`;
  }
}
