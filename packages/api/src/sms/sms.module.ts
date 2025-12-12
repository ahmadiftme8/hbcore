import { Module } from '@nestjs/common';
import { MockSmsService } from './mock-sms.service';
import type { SmsStrategy } from './sms-strategy.interface';

@Module({
  providers: [
    {
      provide: 'SmsStrategy',
      useClass: MockSmsService,
    },
    MockSmsService,
  ],
  exports: ['SmsStrategy', MockSmsService],
})
export class SmsModule {}
