import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('demo')
export class DemoProcessor extends WorkerHost {
  async process(job: Job): Promise<any> {
    // Simulate work
    await new Promise((resolve) => setTimeout(resolve, 250));
    return { echoed: job.data, processedAt: new Date().toISOString() };
  }
}
