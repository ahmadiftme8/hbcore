import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app/app.module";

async function bootstrap() {
	const _app = await NestFactory.createApplicationContext(AppModule);
	// Bot will start automatically via OnModuleInit lifecycle hook
	console.log("🚀 Application started");
}
bootstrap();
