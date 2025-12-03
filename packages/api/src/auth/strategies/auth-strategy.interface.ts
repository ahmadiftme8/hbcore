import type { AuthResult } from "@hbcore/types";

/**
 * Abstract interface for authentication strategies.
 * Each authentication provider (Firebase, Phone OTP, etc.) implements this interface.
 */
export interface AuthStrategy {
	/**
	 * Authenticate using the provided token/credentials
	 * @param token - Authentication token or credential from the client
	 * @returns Authentication result with user and provider UID
	 * @throws Error if authentication fails
	 */
	authenticate(token: string): Promise<AuthResult>;
}
