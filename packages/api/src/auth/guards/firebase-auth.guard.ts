import type { User } from "@hbcore/types";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { FirebaseService } from "@/firebase/firebase.service";
import { UsersService } from "@/users/users.service";

/**
 * Guard that verifies Firebase ID tokens and attaches the user to the request
 */
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
	constructor(
		private readonly firebaseService: FirebaseService,
		private readonly usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization;

		if (!authHeader) {
			throw new UnauthorizedException("Authorization header is missing");
		}

		const [scheme, token] = authHeader.split(" ");

		if (scheme !== "Bearer" || !token) {
			throw new UnauthorizedException("Invalid authorization header format");
		}

		try {
			// Verify the Firebase ID token
			const decodedToken = await this.firebaseService.verifyIdToken(token);

			// Find the user by Firebase UID
			const user = await this.usersService.findByFirebaseUid(decodedToken.uid);

			if (!user) {
				throw new UnauthorizedException("User not found");
			}

			// Attach user to request
			request.user = user;

			return true;
		} catch (error) {
			if (error instanceof UnauthorizedException) {
				throw error;
			}
			throw new UnauthorizedException("Invalid or expired token");
		}
	}
}
