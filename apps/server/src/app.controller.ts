
import { Controller, All, Req, Res, Get } from '@nestjs/common';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '@nestjs-react-router/db';
import { redis } from '@nestjs-react-router/redis';
import { readFileSync } from 'fs';
import { join } from 'path';

@Controller()


export class AppController {

  // @Get('/')
  // async index(@Res() reply: FastifyReply) {
  //   reply.send({ message: 'Hello World' });
  // }

  @Get('/api/session-debug')
  async sess(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    reply.send({ sid: (req as any).sessionId || null, session: (req as any).session || null });
  }

  @Get('/api/queue/add')
  async addJob(@Res() reply: FastifyReply) {
    const job = await demoQueue.add('echo', { ts: Date.now() });
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

  @All('*')
  async handle(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    // Handle static assets directly
    if (req.url === '/static/entry-client.js') {
      try {
        const clientPath = '/Users/justin/Documents/WebDevelopment/TURBO/rr7-nest-monorepo-updated-all/apps/web/dist/client/entry-client.js';
        const content = readFileSync(clientPath, 'utf8');
        reply.header('Content-Type', 'application/javascript');
        reply.send(content);
        return;
      } catch (e) {
        console.error('Error serving client script:', e);
        reply.code(404).send({ error: 'Client script not found' });
        return;
      }
    }

    // Handle CSS files
    if (req.url?.startsWith('/static/assets/') && req.url.endsWith('.css')) {
      try {
        const cssPath = '/Users/justin/Documents/WebDevelopment/TURBO/rr7-nest-monorepo-updated-all/apps/web/dist/client' + req.url.replace('/static', '');
        const content = readFileSync(cssPath, 'utf8');
        reply.header('Content-Type', 'text/css');
        reply.send(content);
        return;
      } catch (e) {
        console.error('Error serving CSS:', e);
        reply.code(404).send({ error: 'CSS file not found' });
        return;
      }
    }
    const url = `http://${req.headers.host}${req.url}`;
    const method = req.method;
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (typeof v === 'string') headers.set(k, v);
    }

    let body: any = undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      if ((req as any).raw && (req as any).raw.readable) {
        body = (req as any).raw;
      } else if (req.body) {
        if (headers.get('content-type')?.includes('application/json')) {
          body = JSON.stringify(req.body);
        }
      }
    }

    const request = new Request(url, { method, headers, body });

    // @ts-ignore: importing TSX outside this package for SSR bridge only in dev
    const webEntry: any = await import('../../../apps/web/src/entry-server');
    const { handler, context } = await webEntry.resolveContext(request);

    if (context instanceof Response) {
      const status = context.status;
      const headersObj: Record<string, string> = {};
      context.headers.forEach((v, k) => (headersObj[k] = v));
      reply.code(status).headers(headersObj);
      const buf = Buffer.from(await context.arrayBuffer());
      reply.send(buf);
      return;
    }

    const { createRouter } = webEntry as any;
    const router = createRouter(handler, context);
    reply.header('Content-Type', 'text/html; charset=utf-8');
    reply.header('Cache-Control', 'no-store');

    const { pipeToNodeWritable } = webEntry as any;
    pipeToNodeWritable(reply.raw, router, context);
  }
}


import { demoQueue } from './queue';
