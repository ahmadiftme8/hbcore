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

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
