import type { User } from '@hbcore/types';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PhoneStrategy } from '../strategies/phone.strategy';
import { UsersService } from '@/users/users.service';

/**
 * Guard that verifies phone JWT tokens and attaches the user to the request
 */
@Injectable()
export class PhoneAuthGuard implements CanActivate {
  constructor(
    private readonly phoneStrategy: PhoneStrategy,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      // Verify the phone JWT token using PhoneStrategy
      const result = await this.phoneStrategy.authenticate(token);

      // Attach user to request
      request.user = result.user;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
