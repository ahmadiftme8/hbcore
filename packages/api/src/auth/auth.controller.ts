import type { User, UserInfo } from '@hbcore/types';
import { Body, Controller, Get, Logger, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { FingerprintingService } from '@/fingerprinting/fingerprinting.service';
import { RequireFeatureFlag } from '@/unleash/decorators/feature-flag.decorator';
import { FeatureFlag } from '@/unleash/feature-flags.enum';
import { FeatureFlagGuard } from '@/unleash/guards/feature-flag.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { PhoneAuthGuard } from './guards/phone-auth.guard';

// interface FirebaseAuthDto {
//   idToken: string;
// }

interface RequestOtpDto {
  phone: string;
  turnstileToken: string;
}

interface VerifyOtpDto {
  phone: string;
  code: string;
}

@Controller('auth')
@UseGuards(FeatureFlagGuard)
@RequireFeatureFlag(FeatureFlag.AUTH)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly fingerprintingService: FingerprintingService,
  ) {}

  /**
   * Authenticate with Firebase ID token
   * POST /auth/firebase
   * @deprecated Google/Firebase authentication is disabled
   */
  // @Post('firebase')
  // async authenticateWithFirebase(@Body() body: FirebaseAuthDto): Promise<{
  //   user: User & UserInfo;
  // }> {
  //   if (!body.idToken || typeof body.idToken !== 'string' || body.idToken.trim().length === 0) {
  //     this.logger.warn('Firebase authentication attempted with missing or invalid idToken');
  //     throw new BadRequestException('Firebase ID token is required');
  //   }

  //   try {
  //     const result = await this.authService.authenticateWithFirebase(body.idToken);
  //     this.logger.log('Firebase authentication successful', {
  //       userId: result.user.id,
  //       firebaseUid: result.providerUid,
  //     });
  //     return {
  //       user: result.user,
  //     };
  //   } catch (error) {
  //     this.logger.error('Firebase authentication failed', {
  //       error: error instanceof Error ? error.message : String(error),
  //       stack: error instanceof Error ? error.stack : undefined,
  //     });
  //     throw error;
  //   }
  // }

  /**
   * Request OTP for phone authentication
   * POST /auth/phone/request-otp
   */
  @Post('phone/request-otp')
  async requestOTP(
    @Body() body: RequestOtpDto,
    @Req() request: Request,
  ): Promise<{
    message: string;
  }> {
    // Extract IP address
    const ip = this.getClientIp(request);

    // Generate fingerprint
    const fingerprint = this.fingerprintingService.generateFingerprint(request);

    // Request OTP
    await this.authService.requestOTP(body.phone, body.turnstileToken, fingerprint, ip);

    return {
      message: 'OTP sent successfully',
    };
  }

  /**
   * Verify OTP and authenticate
   * POST /auth/phone/verify-otp
   */
  @Post('phone/verify-otp')
  async verifyOTP(@Body() body: VerifyOtpDto): Promise<{
    user: User & UserInfo;
    token: string;
  }> {
    const result = await this.authService.verifyOTP(body.phone, body.code);
    return {
      user: result.user,
      token: result.token,
    };
  }

  /**
   * Get current authenticated user
   * GET /auth/me
   */
  @Get('me')
  @UseGuards(PhoneAuthGuard)
  async getCurrentUser(@CurrentUser() user: User & UserInfo): Promise<{
    user: User & UserInfo;
  }> {
    return { user };
  }

  /**
   * Get client IP address from request
   */
  private getClientIp(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
      return ips.trim();
    }

    const realIp = request.headers['x-real-ip'];
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }

    return request.socket.remoteAddress || 'unknown';
  }
}
