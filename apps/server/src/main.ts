import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import sessionPlugin from './plugins/session';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const port = Number(process.env.PORT || 3000);

  await app.register(sessionPlugin);

  await app.listen(port, '0.0.0.0');
  console.log(`Server on http://localhost:${port}`);
}
bootstrap();
