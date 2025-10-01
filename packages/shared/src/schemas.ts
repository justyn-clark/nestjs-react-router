
import { z } from 'zod';

export const HelloSchema = z.object({
  msg: z.string(),
});

export type Hello = z.infer<typeof HelloSchema>;
