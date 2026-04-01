import assert from 'node:assert/strict';
import test, { mock } from 'node:test';
import { dashboardLoader, rootLoader } from './loaders';

function makeLoaderArgs(request: Request): Parameters<typeof rootLoader>[0] {
  return {
    request,
    params: {},
    context: undefined,
    unstable_pattern: '',
    unstable_url: new URL(request.url),
  };
}

test('dashboardLoader redirects to home when no session user exists', async () => {
  const restore = mock.method(globalThis, 'fetch', async () => {
    return Response.json({ user: null }, { status: 200 });
  });

  try {
    const response = await dashboardLoader(
      makeLoaderArgs(new Request('http://localhost:3000/dashboard'))
    );

    assert.equal(response.status, 302);
    assert.match(
      response.headers.get('Location') || '',
      /Please\+login\+to\+access\+the\+dashboard/
    );
  } finally {
    restore.mock.restore();
  }
});

test('rootLoader returns starter shell data', async () => {
  const restore = mock.method(globalThis, 'fetch', async () => {
    return Response.json({ user: { email: 'hello@example.com' } }, { status: 200 });
  });

  try {
    const response = await rootLoader(
      makeLoaderArgs(new Request('http://localhost:3000/?message=ready'))
    );

    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(payload.user.email, 'hello@example.com');
    assert.equal(payload.message, 'ready');
  } finally {
    restore.mock.restore();
  }
});
