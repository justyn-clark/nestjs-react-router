
import { Controller, Post, Body, Res, Get, Req } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

interface SessionRequest extends FastifyRequest {
  session: Record<string, unknown> | null;
  sessionId?: string;
}

interface SessionServer {
  saveSession(req: FastifyRequest): Promise<void>;
  destroySession(req: FastifyRequest, reply: FastifyReply): Promise<void>;
}

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() body: { email?: string }, @Req() req: SessionRequest, @Res() reply: FastifyReply) {
    const { email } = body || {};
    if (!email) {
      reply.code(400).send({ error: 'email required' });
      return;
    }
    // naive: put user in session
    if (req.session) {
      req.session.user = { email };
    }
    await (req.server as SessionServer).saveSession(req);
    reply.send({ ok: true });
  }

  @Post('logout')
  async logout(@Req() req: SessionRequest, @Res() reply: FastifyReply) {
    await (req.server as SessionServer).destroySession(req, reply);
    reply.send({ ok: true });
  }

  @Get('me')
  async me(@Req() req: SessionRequest, @Res() reply: FastifyReply) {
    const user = req.session?.user || null;
    reply.send({ user });
  }

  @Get('login')
  async loginGet(@Res() reply: FastifyReply) {
    reply.code(405).send({
      error: 'Method not allowed',
      message: 'Use POST /auth/login with email in request body'
    });
  }

  @Get('logout')
  async logoutGet(@Res() reply: FastifyReply) {
    reply.code(405).send({
      error: 'Method not allowed',
      message: 'Use POST /auth/logout to logout'
    });
  }
}
