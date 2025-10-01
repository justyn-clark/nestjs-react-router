import { Queue } from 'bullmq';

export const demoQueue = new Queue('demo', {
  connection: { url: process.env.REDIS_URL || 'redis://localhost:6379' },
});
