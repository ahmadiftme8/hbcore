import { Controller, Get } from '@nestjs/common';
import { UnleashService } from '@/unleash/unleash.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly unleashService: UnleashService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }

  @Get('ping')
  ping(): { message: string } {
    const isEnabled = this.unleashService.isEnabled('ping-pong');
    return { message: isEnabled ? 'pong' : 'ping' };
  }
}
