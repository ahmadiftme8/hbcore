import { z } from "zod";

export const envSchema = z.object({
	// Server
	PORT: z.string().default("3000").transform(Number),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	// Postgres
	POSTGRES_HOST: z.string().min(1, "POSTGRES_HOST is required"),
	POSTGRES_PORT: z.string().min(1, "POSTGRES_PORT is required"),
	POSTGRES_USER: z.string().min(1, "POSTGRES_USER is required"),
	POSTGRES_PASSWORD: z.string().min(1, "POSTGRES_PASSWORD is required"),
	POSTGRES_NAME: z.string().min(1, "POSTGRES_NAME is required"),
});

export type EnvSchema = z.infer<typeof envSchema>;

