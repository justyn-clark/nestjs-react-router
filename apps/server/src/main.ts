import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './modules/app/app.module';
import sessionPlugin from './plugins/session';

const PORT = Number.parseInt(
  process.env.PORT || (process.env.NODE_ENV === 'production' ? '8080' : '3000'),
  10
);

const HOST = process.env.NODE_ENV === 'production' ? '::' : 'localhost';

let app: NestFastifyApplication;

async function bootstrap() {
  try {
    app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        logger: true,
        disableRequestLogging: true,
        routerOptions: {
          ignoreTrailingSlash: true,
        },
        forceCloseConnections: true,
        trustProxy: true,
      }),
      {
        abortOnError: false,
        bufferLogs: true,
        snapshot: true,
      }
    );

    await app.register(sessionPlugin as never);

    await app.listen(PORT, HOST);
    console.log(`Server on http://${HOST}:${PORT}`);
  } catch (error) {
    console.error('Failed to start application:', error);
    if (app) {
      await app.close();
    }
    process.exit(1);
  }
}

let isBootstrapping = false;

if (!isBootstrapping) {
  isBootstrapping = true;
  bootstrap()
    .catch(async (error) => {
      console.error('Bootstrap failed:', error);
      if (app) {
        await app.close();
      }
      process.exit(1);
    })
    .finally(() => {
      isBootstrapping = false;
    });
}
