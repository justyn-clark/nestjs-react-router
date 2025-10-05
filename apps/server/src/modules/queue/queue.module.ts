import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DemoProcessor } from './demo.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'demo',
    }),
  ],
  providers: [DemoProcessor],
  exports: [BullModule],
})
export class QueueModule {}
