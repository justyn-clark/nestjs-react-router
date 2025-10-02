
import { Controller, Post, Body, Res, Get, Req } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Controller('api')
export class AuthController {
  @Post('login')
  async login(@Body() body: any, @Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const { email } = body || {};
    if (!email) {
      reply.code(400).send({ error: 'email required' });
      return;
    }
    // naive: put user in session
    (req as any).session.user = { email };
    await (req as any).server.saveSession(req);
    reply.send({ ok: true });
  }

  @Post('logout')
  async logout(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    await (req as any).server.destroySession(req, reply);
    reply.send({ ok: true });
  }

  @Get('me')
  async me(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    const user = (req as any).session?.user || null;
    reply.send({ user });
  }

  @Get('login')
  async loginGet(@Res() reply: FastifyReply) {
    reply.code(405).send({
      error: 'Method not allowed',
      message: 'Use POST /api/login with email in request body'
    });
  }

  @Get('logout')
  async logoutGet(@Res() reply: FastifyReply) {
    reply.code(405).send({
      error: 'Method not allowed',
      message: 'Use POST /api/logout to logout'
    });
  }
}
