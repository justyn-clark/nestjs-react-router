import { Controller, Get, Inject, Req, Res } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ControlPlaneService } from './control-plane.service';

@Controller('api/control-plane')
export class ControlPlaneController {
  constructor(@Inject(ControlPlaneService) private readonly controlPlane: ControlPlaneService) {}

  @Get('summary')
  async summary(@Res() reply: FastifyReply) {
    reply.send(await this.controlPlane.getSummary());
  }

  @Get('events')
  async events(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache, no-transform');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.flushHeaders?.();

    this.controlPlane.addClient(reply);

    req.raw.on('close', () => {
      this.controlPlane.removeClient(reply);
      reply.raw.end();
    });
  }
}
