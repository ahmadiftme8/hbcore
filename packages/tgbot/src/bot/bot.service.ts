import { ConfigService } from "@/config/config.service";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Bot } from "grammy";

@Injectable()
export class BotService implements OnModuleInit, OnModuleDestroy {
	private bot: Bot;

	constructor(private readonly configService: ConfigService) {
		const token = this.configService.e.TELEGRAM_BOT_TOKEN;
		this.bot = new Bot(token);

		this.setupHandlers();
	}

	private setupHandlers() {
		// Start command handler
		this.bot.command("start", async (ctx) => {
			await ctx.reply("Hello! Welcome to the bot. 👋");
		});
	}

	async onModuleInit() {
		await this.bot.start();
		console.log("🤖 Telegram bot started successfully");
	}

	async onModuleDestroy() {
		await this.bot.stop();
		console.log("🤖 Telegram bot stopped");
	}
}
