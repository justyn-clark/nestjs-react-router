import { getDb, schema } from '@nestjs-react-router/db';
import { type ContactSubmissionInput, ContactSubmissionSchema } from '@nestjs-react-router/shared';
import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { ControlPlaneService } from '../control-plane/control-plane.service';

@Controller('api/contact')
export class ContactController {
  constructor(@Inject(ControlPlaneService) private readonly controlPlane: ControlPlaneService) {}

  @Post()
  async submit(@Body() body: ContactSubmissionInput, @Res() reply: FastifyReply) {
    const parsed = ContactSubmissionSchema.safeParse(body);

    if (!parsed.success) {
      reply.code(400).send({
        ok: false,
        error: parsed.error.flatten(),
      });
      return;
    }

    const db = getDb();
    const [submission] = await db.insert(schema.contactSubmissions).values(parsed.data).returning({
      id: schema.contactSubmissions.id,
      createdAt: schema.contactSubmissions.createdAt,
    });

    this.controlPlane.recordEvent({
      type: 'contact.submitted',
      message: `Contact submission stored for ${parsed.data.email}.`,
      level: 'success',
      metadata: { submissionId: submission.id },
    });

    reply.code(201).send({
      ok: true,
      submission,
    });
  }
}
