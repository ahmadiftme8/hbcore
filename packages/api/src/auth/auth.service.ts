import type { AuthResult } from "@hbcore/types";
import { Injectable } from "@nestjs/common";
import { FirebaseStrategy } from "./strategies/firebase.strategy";

@Injectable()
export class AuthService {
	constructor(private readonly firebaseStrategy: FirebaseStrategy) {}

	/**
	 * Authenticate with Firebase
	 * @param idToken - Firebase ID token
	 * @returns Authentication result
	 */
	async authenticateWithFirebase(idToken: string): Promise<AuthResult> {
		return this.firebaseStrategy.authenticate(idToken);
	}
}
