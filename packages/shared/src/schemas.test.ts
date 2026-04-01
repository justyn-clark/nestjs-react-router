import assert from 'node:assert/strict';
import test from 'node:test';
import { ContactSubmissionSchema, HealthStatusSchema } from './schemas';

test('ContactSubmissionSchema accepts a valid submission', () => {
  const parsed = ContactSubmissionSchema.safeParse({
    email: 'hello@example.com',
    name: 'Starter User',
    message: 'I want to use this starter for a real client project.',
  });

  assert.equal(parsed.success, true);
});

test('ContactSubmissionSchema rejects too-short messages', () => {
  const parsed = ContactSubmissionSchema.safeParse({
    email: 'hello@example.com',
    name: 'Starter User',
    message: 'short',
  });

  assert.equal(parsed.success, false);
});

test('HealthStatusSchema matches the starter health payload shape', () => {
  const parsed = HealthStatusSchema.safeParse({
    ok: true,
    services: {
      redis: { ok: true },
      postgres: { ok: true, configured: true },
    },
    timestamp: new Date().toISOString(),
  });

  assert.equal(parsed.success, true);
});
