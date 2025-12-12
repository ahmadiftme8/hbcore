import { z } from 'zod';

export const envSchema = z.object({
  // Server
  API_PORT: z.string().default('3001').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // CORS
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000,http://localhost:3001')
    .transform((val) => val.split(',').map((origin) => origin.trim())),
  // Postgres
  POSTGRES_HOST: z.string().min(1, 'POSTGRES_HOST is required'),
  POSTGRES_PORT: z.string().min(1, 'POSTGRES_PORT is required'),
  POSTGRES_USER: z.string().min(1, 'POSTGRES_USER is required'),
  POSTGRES_PASSWORD: z.string().min(1, 'POSTGRES_PASSWORD is required'),
  POSTGRES_NAME: z.string().min(1, 'POSTGRES_NAME is required'),
  POSTGRES_SSL: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),
  // Firebase
  FIREBASE_PROJECT_ID: z.string().min(1, 'FIREBASE_PROJECT_ID is required'),
  FIREBASE_CLIENT_EMAIL: z.string().min(1, 'FIREBASE_CLIENT_EMAIL is required'),
  FIREBASE_PRIVATE_KEY: z.string().min(1, 'FIREBASE_PRIVATE_KEY is required'),
  // Redis
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  // Turnstile
  TURNSTILE_SECRET_KEY: z.string().min(1, 'TURNSTILE_SECRET_KEY is required'),
  // OTP
  OTP_LENGTH: z.string().default('6').transform(Number),
  OTP_EXPIRY_MINUTES: z.string().default('2').transform(Number),
  OTP_HMAC_SECRET: z.string().optional(),
  OTP_LOCKOUT_MINUTES: z.string().default('15').transform(Number),
  // JWT
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRY_HOURS: z.string().default('72').transform(Number),
});

export type EnvSchema = z.infer<typeof envSchema>;
