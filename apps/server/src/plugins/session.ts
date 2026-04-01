import { randomUUID } from 'node:crypto';
import cookie from '@fastify/cookie';
import { redis } from '@nestjs-react-router/redis';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    session: Record<string, unknown> | null;
    sessionId?: string;
  }

  interface FastifyInstance {
    saveSession(req: FastifyRequest): Promise<void>;
    destroySession(req: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export default fp(
  async function sessionPlugin(app: FastifyInstance) {
    await app.register(cookie, {
      secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
      hook: 'onRequest',
    });

    app.addHook('onRequest', async (req, reply) => {
      const sidCookie = req.cookies.sid;
      let sid = sidCookie;

      if (!sid) {
        sid = randomUUID();
        reply.setCookie('sid', sid, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          signed: false,
          maxAge: SESSION_TTL_SECONDS,
        });
        await redis.setex(`sess:${sid}`, SESSION_TTL_SECONDS, JSON.stringify({}));
        req.session = {};
        req.sessionId = sid;
        return;
      }

      const raw = await redis.get(`sess:${sid}`);
      if (raw) {
        req.session = JSON.parse(raw) as Record<string, unknown>;
      } else {
        req.session = {};
        await redis.setex(`sess:${sid}`, SESSION_TTL_SECONDS, JSON.stringify({}));
      }
      req.sessionId = sid;
    });

    app.decorate('saveSession', async function saveSession(req: FastifyRequest) {
      if (!req.sessionId || !req.session) {
        return;
      }
      await redis.setex(`sess:${req.sessionId}`, SESSION_TTL_SECONDS, JSON.stringify(req.session));
    });

    app.decorate(
      'destroySession',
      async function destroySession(req: FastifyRequest, reply: FastifyReply) {
        if (!req.sessionId) {
          return;
        }
        await redis.del(`sess:${req.sessionId}`);
        reply.clearCookie('sid', { path: '/' });
      }
    );
  },
  { name: 'session' }
);
