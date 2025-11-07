import { Injectable } from "@nestjs/common";
import { type EnvSchema, envSchema } from "./config.types";

@Injectable()
export class ConfigService {
	readonly e: EnvSchema;

	static instance: ConfigService;

	constructor() {
		const parsed = envSchema.safeParse(process.env);
		if (!parsed.success) {
			console.error("❌ Invalid environment variables:");
			for (const err of parsed.error.issues) {
				console.error(`- ${err.path.join(".")}: ${err.message}`);
			}
			process.exit(1);
		}
		this.e = parsed.data;
	}
}
