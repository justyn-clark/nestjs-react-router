import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { checkDatabaseHealth } from '@nestjs-react-router/db';
import { redis } from '@nestjs-react-router/redis';
import { InjectQueue } from '@nestjs/bullmq';
import { All, Controller, Get, Req, Res } from '@nestjs/common';
import type { Queue } from 'bullmq';
import type { FastifyReply, FastifyRequest } from 'fastify';

interface SessionRequest extends FastifyRequest {
  session: Record<string, unknown> | null;
  sessionId?: string;
}

function firstExistingPath(candidates: string[]) {
  const match = candidates.find((candidate) => existsSync(candidate));

  if (!match) {
    throw new Error(`No matching file found. Checked: ${candidates.join(', ')}`);
  }

  return match;
}

function resolveClientEntryPath() {
  return firstExistingPath([
    join(process.cwd(), 'apps/web/dist/client/entry-client.js'),
    join(process.cwd(), '../web/dist/client/entry-client.js'),
  ]);
}

function resolveStaticAssetPath(requestUrl: string) {
  const assetPath = requestUrl.replace('/static', '');

  return firstExistingPath([
    join(process.cwd(), 'apps/web/dist/client', assetPath),
    join(process.cwd(), '../web/dist/client', assetPath),
  ]);
}

async function loadWebEntry() {
  const webEntryPath = firstExistingPath([
    join(process.cwd(), 'apps/server/dist/web/src/entry-server.js'),
    join(process.cwd(), 'apps/web/src/entry-server.tsx'),
    join(process.cwd(), 'dist/web/src/entry-server.js'),
    join(process.cwd(), '../web/src/entry-server.tsx'),
  ]);

  return import(pathToFileURL(webEntryPath).href);
}

@Controller()
export class AppController {
  constructor(@InjectQueue('demo') private demoQueue: Queue) {}

  @Get('/api/session-debug')
  async sess(@Req() req: SessionRequest, @Res() reply: FastifyReply) {
    reply.send({ sid: req.sessionId || null, session: req.session || null });
  }

  @Get('/api/queue/add')
  async addJob(@Res() reply: FastifyReply) {
    const job = await this.demoQueue.add('echo', { ts: Date.now() });
    reply.send({ enqueued: job.id });
  }

  @Get('/api/health')
  async health(@Res() reply: FastifyReply) {
    const timestamp = new Date().toISOString();

    const redisStatus = await redis
      .ping()
      .then(() => ({ ok: true as const }))
      .catch((error) => ({
        ok: false as const,
        error: error instanceof Error ? error.message : String(error),
      }));

    const postgresStatus = await checkDatabaseHealth();
    const ok = redisStatus.ok && postgresStatus.ok;

    reply.code(ok ? 200 : 503).send({
      ok,
      services: {
        redis: redisStatus,
        postgres: postgresStatus,
      },
      timestamp,
    });
  }

  @Get('favicon.ico')
  async favicon(@Res() reply: FastifyReply) {
    reply.code(204).send();
  }

  @Get('static/entry-client.js')
  async clientScript(@Res() reply: FastifyReply) {
    try {
      const content = readFileSync(resolveClientEntryPath(), 'utf8');
      reply.header('Content-Type', 'application/javascript');
      reply.send(content);
    } catch (error) {
      console.error('Error serving client script:', error);
      reply.code(404).send({ error: 'Client script not found' });
    }
  }

  @Get('static/assets/*')
  async cssAssets(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    try {
      const content = readFileSync(resolveStaticAssetPath(req.url), 'utf8');
      reply.header('Content-Type', 'text/css');
      reply.send(content);
    } catch (error) {
      console.error('Error serving CSS:', error);
      reply.code(404).send({ error: 'CSS file not found' });
    }
  }

  @Get('.well-known/*')
  async wellKnown(@Res() reply: FastifyReply) {
    reply.code(404).send();
  }

  @All('*')
  async handle(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const url = `http://${req.headers.host}${req.url}`;
    const method = req.method;
    const headers = new Headers();

    for (const [k, v] of Object.entries(req.headers)) {
      if (typeof v === 'string') {
        headers.set(k, v);
      }
    }

    let body: BodyInit | undefined;
    if (method !== 'GET' && method !== 'HEAD' && req.body && typeof req.body === 'object') {
      if (headers.get('content-type')?.includes('application/json')) {
        body = JSON.stringify(req.body);
      } else if (headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
        const formData = new URLSearchParams();
        for (const [key, value] of Object.entries(req.body)) {
          formData.append(key, String(value));
        }
        body = formData;
      }
    }

    const request = new Request(url, { method, headers, body });

    try {
      const webEntry = await loadWebEntry();
      const { handler, context } = await webEntry.resolveContext(request);

      if (context instanceof Response) {
        const status = context.status;
        const headersObj: Record<string, string> = {};
        context.headers.forEach((v, k) => {
          headersObj[k] = v;
        });
        reply.code(status).headers(headersObj);
        const buf = Buffer.from(await context.arrayBuffer());
        reply.send(buf);
        return;
      }

      const router = webEntry.createRouter(handler, context);
      reply.header('Content-Type', 'text/html; charset=utf-8');
      reply.header('Cache-Control', 'no-store');
      webEntry.pipeToNodeWritable(reply.raw, router, context);
    } catch (error: unknown) {
      const isBrowserNoise =
        req.url?.includes('favicon.ico') ||
        req.url?.startsWith('/.well-known/') ||
        req.url?.includes('chrome-extension') ||
        req.url?.includes('devtools') ||
        req.url?.includes('__webpack') ||
        req.url?.includes('hot-update') ||
        req.url?.includes('service-worker') ||
        req.url?.includes('manifest.json') ||
        req.url?.includes('robots.txt') ||
        req.url?.includes('sitemap.xml');

      if (!isBrowserNoise) {
        console.error(
          'React Router error:',
          error instanceof Error ? error.message : String(error)
        );
      }

      reply.code(404).send('Not Found');
    }
  }
}
