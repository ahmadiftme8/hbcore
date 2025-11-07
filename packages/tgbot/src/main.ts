import { AppModule } from "@/app/app.module";
import { NestFactory } from "@nestjs/core";

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(AppModule);
	// Bot will start automatically via OnModuleInit lifecycle hook
	console.log("🚀 Application started");
}
bootstrap();
