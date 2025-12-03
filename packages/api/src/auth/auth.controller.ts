import type { User, UserInfo } from '@hbcore/types';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';

interface FirebaseAuthDto {
  idToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
