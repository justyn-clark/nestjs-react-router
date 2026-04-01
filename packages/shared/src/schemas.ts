import { z } from 'zod';

export const HelloSchema = z.object({
  msg: z.string(),
});

export const ContactSubmissionSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(2_000),
});

export const HealthStatusSchema = z.object({
  ok: z.boolean(),
  services: z.object({
    redis: z.object({
      ok: z.boolean(),
    }),
    postgres: z.object({
      ok: z.boolean(),
      configured: z.boolean(),
    }),
  }),
  timestamp: z.string(),
});

export type Hello = z.infer<typeof HelloSchema>;
export type ContactSubmissionInput = z.infer<typeof ContactSubmissionSchema>;
export type HealthStatus = z.infer<typeof HealthStatusSchema>;
