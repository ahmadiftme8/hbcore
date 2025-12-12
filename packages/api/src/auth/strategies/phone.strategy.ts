import { type AuthResult, PhoneSchema, ProviderUidSchema } from '@hbcore/types';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@/config/config.service';
import { UsersService } from '@/users/users.service';
import type { AuthStrategy } from './auth-strategy.interface';

interface PhoneJwtPayload {
  phone: string;
  userId: number;
  iat?: number;
  exp?: number;
}

@Injectable()
export class PhoneStrategy implements AuthStrategy {
  private readonly logger = new Logger(PhoneStrategy.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Authenticate using phone JWT token
   * @param idToken - JWT token generated after OTP verification
   * @returns Authentication result with user and provider UID (phone)
   */
  async authenticate(idToken: string): Promise<AuthResult> {
    try {
      const config = this.configService.e;
      const decoded = jwt.verify(idToken, config.JWT_SECRET) as PhoneJwtPayload;

      // Validate phone from token
      let phone: string;
      try {
        phone = PhoneSchema.parse(decoded.phone);
      } catch (validationError) {
        this.logger.warn('Invalid phone format in token', { phone: decoded.phone });
        throw new UnauthorizedException('Invalid token: phone format is invalid');
      }

      // Find user by phone
      const user = await this.usersService.findByPhone(phone);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Validate provider UID
      let providerUid: string;
      try {
        providerUid = ProviderUidSchema.parse(phone);
      } catch (validationError) {
        this.logger.error('Failed to parse provider UID', { phone, error: validationError });
        throw new UnauthorizedException('Invalid token: provider UID is invalid');
      }

      return {
        user,
        providerUid,
      };
    } catch (error) {
      // Re-throw UnauthorizedException as-is
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Handle JWT-specific errors
      if (error instanceof jwt.JsonWebTokenError) {
        this.logger.warn('JWT token error', { error: error.message });
        throw new UnauthorizedException('Invalid token');
      }

      if (error instanceof jwt.TokenExpiredError) {
        this.logger.warn('JWT token expired');
        throw new UnauthorizedException('Token expired');
      }

      if (error instanceof jwt.NotBeforeError) {
        this.logger.warn('JWT token not active yet');
        throw new UnauthorizedException('Token not active');
      }

      // Log unexpected errors for debugging
      this.logger.error('Unexpected error during phone authentication', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      throw new UnauthorizedException('Authentication failed');
    }
  }
}
