import type { AuthResult } from "@hbcore/types";
import { Injectable } from "@nestjs/common";
import { FirebaseService } from "@/firebase/firebase.service";
import { UsersService } from "@/users/users.service";
import type { AuthStrategy } from "./auth-strategy.interface";

@Injectable()
export class FirebaseStrategy implements AuthStrategy {
	constructor(
		private readonly firebaseService: FirebaseService,
		private readonly usersService: UsersService,
	) {}

	/**
	 * Authenticate using Firebase ID token
	 * @param idToken - Firebase ID token from the client
	 * @returns Authentication result with user and Firebase UID
	 */
	async authenticate(idToken: string): Promise<AuthResult> {
		// Verify the Firebase ID token
		const decodedToken = await this.firebaseService.verifyIdToken(idToken);

		// Extract user information from the decoded token
		const firebaseUid = decodedToken.uid;
		const email = decodedToken.email || null;
		const name = decodedToken.name || null;
		const photoUrl = decodedToken.picture || null;

		// Find or create user by Firebase UID
		const user = await this.usersService.findOrCreateByFirebaseUid(firebaseUid, {
			email,
			name,
			photoUrl,
		});

		return {
			user,
			providerUid: firebaseUid,
		};
	}
}
