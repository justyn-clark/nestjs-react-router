import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ControlPlaneModule } from '../control-plane/control-plane.module';
import { DemoProcessor } from './demo.processor';

@Module({
  imports: [
    ControlPlaneModule,
    BullModule.registerQueue({
      name: 'demo',
    }),
  ],
  providers: [DemoProcessor],
  exports: [BullModule],
})
export class QueueModule {}
