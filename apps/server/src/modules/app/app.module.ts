import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '../auth/auth.controller';
import { ContactController } from '../contact/contact.controller';
import { QueueModule } from '../queue/queue.module';
import { AppController } from './app.controller';

function getRedisConnection() {
  if (process.env.REDIS_URL) {
    const url = new URL(process.env.REDIS_URL);

    return {
      host: url.hostname,
      port: Number.parseInt(url.port || '6379', 10),
      password: url.password || undefined,
      db: url.pathname ? Number.parseInt(url.pathname.replace('/', '') || '0', 10) : 0,
      enableReadyCheck: false,
      enableOfflineQueue: false,
    };
  }

  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: Number.parseInt(process.env.REDIS_DB || '0', 10),
    enableReadyCheck: false,
    enableOfflineQueue: false,
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 1000,
        removeOnFail: 3000,
        backoff: 2000,
      },
    }),
    QueueModule,
  ],
  controllers: [AuthController, ContactController, AppController],
})
export class AppModule {}
