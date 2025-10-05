
import { Controller, All, Req, Res, Get } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { redis } from '@nestjs-react-router/redis';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface SessionRequest extends FastifyRequest {
  session: Record<string, unknown> | null;
  sessionId?: string;
}

@Controller()
export class AppController {
  constructor(
    @InjectQueue('demo') private demoQueue: Queue,
  ) { }

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
    // quick health check hitting Redis and DB
    try {
      await redis.ping();
      reply.send({ ok: true });
    } catch (e) {
      reply.code(500).send({ ok: false, error: String(e) });
    }
  }

  @Get('favicon.ico')
  async favicon(@Res() reply: FastifyReply) {
    // Handle favicon requests silently
    reply.code(204).send();
  }

  @Get('static/entry-client.js')
  async clientScript(@Res() reply: FastifyReply) {
    try {
      const clientPath = join(process.cwd(), '../web/dist/client/entry-client.js');
      const content = readFileSync(clientPath, 'utf8');
      reply.header('Content-Type', 'application/javascript');
      reply.send(content);
    } catch (e) {
      console.error('Error serving client script:', e);
      reply.code(404).send({ error: 'Client script not found' });
    }
  }

  @Get('static/assets/*')
  async cssAssets(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    try {
      const cssPath = join(process.cwd(), `../web/dist/client${req.url.replace('/static', '')}`);
      const content = readFileSync(cssPath, 'utf8');
      reply.header('Content-Type', 'text/css');
      reply.send(content);
    } catch (e) {
      console.error('Error serving CSS:', e);
      reply.code(404).send({ error: 'CSS file not found' });
    }
  }

  @Get('.well-known/*')
  async wellKnown(@Res() reply: FastifyReply) {
    // Handle .well-known requests (browser noise) silently
    reply.code(404).send();
  }

  @All('*')
  async handle(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const url = `http://${req.headers.host}${req.url}`;
    const method = req.method;
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (typeof v === 'string') headers.set(k, v);
    }

    let body: unknown = undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      if ((req as any).raw?.readable) {
        body = (req as any).raw;
      } else if (req.body) {
        if (headers.get('content-type')?.includes('application/json')) {
          body = JSON.stringify(req.body);
        } else if (headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
          // Handle form data
          console.log('Raw form body:', req.body);
          const formData = new URLSearchParams();
          for (const [key, value] of Object.entries(req.body)) {
            console.log(`Form field: ${key} = ${value}`);
            formData.append(key, value as string);
          }
          body = formData;
        }
      }
    }

    const request = new Request(url, { method, headers, body });

    try {
      // @ts-ignore: importing TSX outside this package for SSR bridge only in dev
      const webEntry: { resolveContext: (req: Request) => Promise<{ handler: unknown; context: unknown }>; createRouter: (handler: unknown, context: unknown) => unknown; pipeToNodeWritable: (reply: NodeJS.WritableStream, router: unknown, context: unknown) => void } = await import('../../../../web/src/entry-server');
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

      const { createRouter } = webEntry;
      const router = createRouter(handler, context);
      reply.header('Content-Type', 'text/html; charset=utf-8');
      reply.header('Cache-Control', 'no-store');

      const { pipeToNodeWritable } = webEntry;
      pipeToNodeWritable(reply.raw, router, context);
    } catch (error: unknown) {
      // Only log errors that aren't common browser noise
      const isBrowserNoise = req.url?.includes('favicon.ico') ||
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
        console.error('React Router error:', error instanceof Error ? error.message : String(error));
      }

      // Return a simple 404 for unmatched routes
      reply.code(404).send('Not Found');
    }
  }
}


