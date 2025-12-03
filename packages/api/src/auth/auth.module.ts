import { Module } from "@nestjs/common";
import { FirebaseModule } from "@/firebase/firebase.module";
import { UsersModule } from "@/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { FirebaseStrategy } from "./strategies/firebase.strategy";

@Module({
	imports: [FirebaseModule, UsersModule],
	providers: [AuthService, FirebaseStrategy],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
