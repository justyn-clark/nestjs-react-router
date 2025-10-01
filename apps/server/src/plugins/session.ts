import fp from 'fastify-plugin';
import cookie from '@fastify/cookie';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { redis } from '@nestjs-react-router/redis';
import { randomUUID } from 'crypto';

declare module 'fastify' {
  interface FastifyRequest {
    session: Record<string, any> | null;
    sessionId?: string;
  }
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export default fp(
  async function sessionPlugin(app: FastifyInstance) {
    app.register(cookie, {
      secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
      hook: 'onRequest',
    });

    app.addHook('onRequest', async (req, reply) => {
      const sidCookie = req.cookies['sid'];
      let sid = sidCookie;
      if (!sid) {
        sid = randomUUID();
        reply.setCookie('sid', sid, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          secure: app.environment === 'production',
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
        req.session = JSON.parse(raw);
      } else {
        req.session = {};
        await redis.setex(`sess:${sid}`, SESSION_TTL_SECONDS, JSON.stringify({}));
      }
      req.sessionId = sid;
    });

    app.decorate('saveSession', async function saveSession(req: FastifyRequest) {
      if (!req.sessionId || !req.session) return;
      await redis.setex(`sess:${req.sessionId}`, SESSION_TTL_SECONDS, JSON.stringify(req.session));
    });

    app.decorate(
      'destroySession',
      async function destroySession(req: FastifyRequest, reply: FastifyReply) {
        if (!req.sessionId) return;
        await redis.del(`sess:${req.sessionId}`);
        reply.clearCookie('sid', { path: '/' });
      }
    );
  },
  { name: 'session' } as any
);
