import { z } from "zod";

export const envSchema = z.object({
	// Postgres
	POSTGRES_HOST: z.string().min(1, "POSTGRES_HOST is required"),
	POSTGRES_PORT: z.string().min(1, "POSTGRES_PORT is required"),
	POSTGRES_USER: z.string().min(1, "POSTGRES_USER is required"),
	POSTGRES_PASSWORD: z.string().min(1, "POSTGRES_PASSWORD is required"),
	POSTGRES_NAME: z.string().min(1, "POSTGRES_NAME is required"),
	// Telegram Bot
	TELEGRAM_BOT_TOKEN: z.string().min(1, "TELEGRAM_BOT_TOKEN is required"),
});

export type EnvSchema = z.infer<typeof envSchema>;
