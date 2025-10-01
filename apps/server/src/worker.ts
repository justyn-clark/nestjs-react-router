
import { Worker, Job } from 'bullmq';

const worker = new Worker('demo', async (job: Job) => {
  // simulate work
  await new Promise(r => setTimeout(r, 250));
  return { echoed: job.data };
}, {
  connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
});

worker.on('ready', () => console.log('[worker] ready'));
worker.on('completed', (job) => console.log('[worker] completed', job.id));
worker.on('failed', (job, err) => console.error('[worker] failed', job?.id, err));
