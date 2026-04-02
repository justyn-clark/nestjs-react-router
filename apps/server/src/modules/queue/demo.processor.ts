import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import type { Job } from 'bullmq';
import { ControlPlaneService } from '../control-plane/control-plane.service';
import type { ControlPlaneService as ControlPlaneServiceType } from '../control-plane/control-plane.service';

@Processor('demo')
export class DemoProcessor extends WorkerHost {
  constructor(
    @Inject(ControlPlaneService)
    private readonly controlPlane: ControlPlaneServiceType
  ) {
    super();
  }

  async process(job: Job): Promise<{ echoed: unknown; processedAt: string }> {
    const taskId = typeof job.data?.taskId === 'string' ? job.data.taskId : null;

    if (taskId) {
      this.controlPlane.updateTask(taskId, { status: 'running' });
    }

    this.controlPlane.recordEvent({
      type: 'task.demo.started',
      message: `Demo job ${job.id} started.`,
      level: 'info',
    });

    await new Promise((resolve) => setTimeout(resolve, 250));

    if (taskId) {
      this.controlPlane.updateTask(taskId, { status: 'completed' });
    }

    this.controlPlane.recordEvent({
      type: 'task.demo.completed',
      message: `Demo job ${job.id} completed.`,
      level: 'success',
    });

    return { echoed: job.data, processedAt: new Date().toISOString() };
  }
}
