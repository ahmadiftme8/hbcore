import type { User, UserInfo } from '@hbcore/types';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { FingerprintingService } from '@/fingerprinting/fingerprinting.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';

interface FirebaseAuthDto {
  idToken: string;
}

interface RequestOtpDto {
  phone: string;
  turnstileToken: string;
}

interface VerifyOtpDto {
  phone: string;
  code: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fingerprintingService: FingerprintingService,
  ) {}

  /**
   * Authenticate with Firebase ID token
   * POST /auth/firebase
   */
  @Post('firebase')
  async authenticateWithFirebase(@Body() body: FirebaseAuthDto): Promise<{
    user: User & UserInfo;
  }> {
    const result = await this.authService.authenticateWithFirebase(body.idToken);
    return {
      user: result.user,
    };
  }

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
  @UseGuards(FirebaseAuthGuard)
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
