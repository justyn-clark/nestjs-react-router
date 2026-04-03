import { Body, Controller, Get, Inject, Post, Req, Res } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ControlPlaneService } from '../control-plane/control-plane.service';

interface SessionRequest extends FastifyRequest {
  session: Record<string, unknown> | null;
  sessionId?: string;
}

@Controller('auth')
export class AuthController {
  constructor(@Inject(ControlPlaneService) private readonly controlPlane: ControlPlaneService) {}

  @Post('login')
  async login(
    @Body() body: { email?: string },
    @Req() req: SessionRequest,
    @Res() reply: FastifyReply
  ) {
    const { email } = body || {};
    if (!email) {
      reply.code(400).send({ error: 'email required' });
      return;
    }

    if (req.session) {
      req.session.user = { email };
    }

    await req.server.saveSession(req);

    try {
      await this.controlPlane.recordEvent({
        type: 'auth.login',
        message: `${email} signed in through demo auth.`,
        level: 'success',
      });
    } catch (error) {
      console.error('Failed to record auth login event:', error);
    }

    reply.send({ ok: true });
  }

  @Post('logout')
  async logout(@Req() req: SessionRequest, @Res() reply: FastifyReply) {
    const email =
      typeof req.session?.user === 'object' && req.session?.user && 'email' in req.session.user
        ? String(req.session.user.email)
        : 'Unknown user';
    await req.server.destroySession(req, reply);

    try {
      await this.controlPlane.recordEvent({
        type: 'auth.logout',
        message: `${email} signed out.`,
        level: 'info',
      });
    } catch (error) {
      console.error('Failed to record auth logout event:', error);
    }

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
      message: 'Use POST /auth/login with email in request body',
    });
  }

  @Get('logout')
  async logoutGet(@Res() reply: FastifyReply) {
    reply.code(405).send({
      error: 'Method not allowed',
      message: 'Use POST /auth/logout to logout',
    });
  }
}
