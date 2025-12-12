/**
 * Interface for SMS sending strategies.
 * Allows different SMS providers to be swapped in/out.
 */
export interface SmsStrategy {
  /**
   * Send an SMS message to a phone number
   * @param phone - Phone number in E.164 format
   * @param message - Message to send
   * @returns Promise that resolves when SMS is sent
   */
  sendSMS(phone: string, message: string): Promise<void>;
}
