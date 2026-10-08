import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import test, { type TestContext } from 'node:test';
import { createRouter, pipeToNodeWritable, resolveContext } from '../entry-server';

function mockBackend(t: TestContext, user: { email: string } | null = null) {
  return t.mock.method(globalThis, 'fetch', async (input: string | URL | Request) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    switch (url.pathname) {
      case '/auth/me':
        return Response.json({ user });
      case '/api/control-plane/summary':
        return Response.json({ activity: [], tasks: [], commands: [] });
      case '/api/contact':
        return Response.json({ submission: { id: 1 } }, { status: 201 });
      default:
        throw new Error(`Unexpected backend request: ${url}`);
    }
  });
}

test('SSR bridge renders the home route and serializes loader data for hydration', async (t) => {
  mockBackend(t);
  const { handler, context } = await resolveContext(
    new Request('http://localhost:3000/?message=ready')
  );
  assert.ok(!(context instanceof Response));
  assert.equal(context.statusCode, 200);
  assert.equal(context.errors, null);
  assert.equal(context.loaderData.root.message, 'ready');

  const chunks: string[] = [];
  const output = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(chunk.toString());
      callback();
    },
  });
  pipeToNodeWritable(output, createRouter(handler, context), context);
  const html = chunks.join('');
  assert.match(html, /<title>React Router 8 \+ NestJS<\/title>/);
  assert.match(html, /NestJS React Router/);
  assert.match(html, /React Router 8/);
  assert.match(html, /__staticRouterHydrationData/);
  const hydration = html.match(/__staticRouterHydrationData = JSON.parse\((.*?)\);/);
  assert.ok(hydration);
  const hydrationData = JSON.parse(JSON.parse(hydration[1]));
  assert.equal(hydrationData.loaderData.root.message, 'ready');
  assert.match(html, /\/static\/entry-client\.js/);
});

test('SSR bridge redirects an unauthenticated protected route', async (t) => {
  mockBackend(t);
  const { context } = await resolveContext(new Request('http://localhost:3000/dashboard'));
  assert.ok(context instanceof Response);
  assert.equal(context.status, 302);
  assert.match(context.headers.get('location') || '', /Please\+login/);
});

test('SSR bridge forwards session cookies to protected route loaders', async (t) => {
  const backend = mockBackend(t, { email: 'router8@example.com' });
  const { context } = await resolveContext(
    new Request('http://localhost:3000/dashboard', { headers: { cookie: 'sid=router8' } })
  );
  assert.ok(!(context instanceof Response));
  assert.equal(context.errors, null);
  assert.equal(context.loaderData.dashboard.user.email, 'router8@example.com');
  const sessionCalls = backend.mock.calls.filter(
    (call) => new URL(String(call.arguments[0])).pathname === '/auth/me'
  );
  assert.equal(sessionCalls.length, 2);
  for (const call of sessionCalls) {
    assert.equal(new Headers(call.arguments[1]?.headers).get('cookie'), 'sid=router8');
  }
});

test('SSR bridge executes contact form actions and revalidates loaders', async (t) => {
  mockBackend(t);
  const { context } = await resolveContext(
    new Request('http://localhost:3000/contact', {
      method: 'POST',
      body: new URLSearchParams({
        email: 'router8@example.com',
        name: 'Router 8',
        message: 'Verifying the migrated SSR action path.',
      }),
    })
  );
  assert.ok(!(context instanceof Response));
  assert.equal(context.errors, null);
  assert.deepEqual(context.actionData?.contact, { ok: true, submission: { id: 1 } });
  assert.ok(context.loaderData.root.controlPlane);
});
