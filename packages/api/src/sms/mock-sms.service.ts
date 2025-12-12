import { Injectable } from '@nestjs/common';
import type { SmsStrategy } from './sms-strategy.interface';

/**
 * Mock SMS service that logs messages to console.
 * This is a placeholder implementation that can be replaced with a real SMS provider.
 */
@Injectable()
export class MockSmsService implements SmsStrategy {
  /**
   * Send an SMS message (mock implementation - logs to console)
   * @param phone - Phone number in E.164 format
   * @param message - Message to send
   */
  async sendSMS(phone: string, message: string): Promise<void> {
    // In production, this would send an actual SMS
    // For now, we just log it to the console
    console.log(`[Mock SMS] Sending to ${phone}: ${message}`);
  }
}
