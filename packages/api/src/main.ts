import { join } from 'node:path';
import { config } from '@dotenvx/dotenvx';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { ConfigService } from '@/config/config.service';

// Load environment variables from root .env file
// Monorepo scripts run from root, so process.cwd() points to root
config({ path: join(process.cwd(), '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.e.API_PORT;

  // Configure CORS
  // Get allowed origins from environment variable
  const allowedOrigins = configService.e.CORS_ORIGINS;

  // Validate CORS configuration
  if (!allowedOrigins || allowedOrigins.length === 0) {
    console.error('⚠️  WARNING: CORS_ORIGINS is empty or not configured!');
    console.error('   CORS requests will be rejected.');
  }

  // Warn if production but only localhost origins are configured
  if (configService.e.NODE_ENV === 'production') {
    const hasProductionOrigin = allowedOrigins.some(
      (origin) => origin.includes('https://') && !origin.includes('localhost'),
    );
    if (!hasProductionOrigin) {
      console.warn('⚠️  WARNING: Production mode detected but no production origins configured!');
      console.warn('   Make sure CORS_ORIGINS includes your production domain (e.g., https://hambazievent.com)');
    }
  }

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      // Normalize origin by removing trailing slash
      const normalizedOrigin = origin.replace(/\/$/, '');

      // Check if origin is in allowed list (case-insensitive comparison)
      const isAllowed = allowedOrigins.some((allowed) => {
        const normalizedAllowed = allowed.replace(/\/$/, '').toLowerCase();
        const normalizedRequest = normalizedOrigin.toLowerCase();
        return normalizedAllowed === normalizedRequest;
      });

      if (isAllowed) {
        return callback(null, true);
      }

      // Reject origin
      return callback(new Error(`CORS: Origin "${origin}" is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // 24 hours - cache preflight requests
  });

  // Listen on all interfaces (0.0.0.0) to allow connections from localhost and other interfaces
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`🌐 CORS enabled for origins: ${allowedOrigins.join(', ')}`);
  console.log(`📡 Server listening on: 0.0.0.0:${port}`);
}

bootstrap().catch((error) => {
  // Write to stderr to ensure it's not buffered/truncated
  const errorOutput = process.stderr;

  errorOutput.write('\n');
  errorOutput.write('═══════════════════════════════════════════════════════════\n');
  errorOutput.write('💥 FATAL ERROR DURING APPLICATION STARTUP\n');
  errorOutput.write('═══════════════════════════════════════════════════════════\n');
  errorOutput.write('\n');

  if (error instanceof Error) {
    errorOutput.write(`Error Name: ${error.name}\n`);
    errorOutput.write(`Error Message: ${error.message}\n`);
    errorOutput.write('\n');
    errorOutput.write('Stack Trace:\n');
    errorOutput.write(error.stack || 'No stack trace available\n');
  } else {
    errorOutput.write('Error Object:\n');
    errorOutput.write(JSON.stringify(error, null, 2));
    errorOutput.write('\n');
  }

  errorOutput.write('\n');
  errorOutput.write('═══════════════════════════════════════════════════════════\n');
  errorOutput.write('\n');

  // Also log to console for Bun's output capture
  console.error('💥 Fatal error during application startup:');
  console.error(error);
  if (error instanceof Error) {
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }

  process.exit(1);
});
