import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@/config/config.service';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

@Injectable()
export class TurnstileService {
  private readonly secretKey: string;
  private readonly siteverifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.e.TURNSTILE_SECRET_KEY;
  }

  /**
   * Verify a Cloudflare Turnstile token
   * @param token - The Turnstile token from the client
   * @param remoteip - Optional IP address of the user
   * @returns true if token is valid, false otherwise
   * @throws BadRequestException if verification fails
   */
  async verifyToken(token: string, remoteip?: string): Promise<boolean> {
    if (!token) {
      throw new BadRequestException('Turnstile token is required');
    }

    try {
      const response = await axios.post<TurnstileVerifyResponse>(
        this.siteverifyUrl,
        {
          secret: this.secretKey,
          response: token,
          remoteip,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000, // 5 second timeout for Turnstile verification
        },
      );

      if (!response.data.success) {
        const errorCodes = response.data['error-codes'] || [];
        throw new BadRequestException(`Turnstile verification failed: ${errorCodes.join(', ')}`);
      }

      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        throw new BadRequestException(`Failed to verify Turnstile token: ${error.message}`);
      }

      throw new BadRequestException('Failed to verify Turnstile token');
    }
  }
}
