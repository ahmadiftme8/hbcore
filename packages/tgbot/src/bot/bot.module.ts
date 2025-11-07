import { ConfigModule } from "@/config/config.module";
import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";

@Module({
	imports: [ConfigModule],
	providers: [BotService],
	exports: [BotService],
})
export class BotModule {}
