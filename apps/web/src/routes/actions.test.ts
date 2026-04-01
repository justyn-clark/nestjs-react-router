import assert from 'node:assert/strict';
import test, { mock } from 'node:test';
import { contactAction, rootAction } from './actions';

function makeRequest(url: string, form: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(form)) {
    formData.set(key, value);
  }

  return new Request(url, {
    method: 'POST',
    body: formData,
  });
}

function makeActionArgs(request: Request): Parameters<typeof rootAction>[0] {
  return {
    request,
    params: {},
    context: undefined,
    unstable_pattern: '',
    unstable_url: new URL(request.url),
  };
}

test('contactAction rejects missing message', async () => {
  const response = await contactAction(
    makeActionArgs(
      makeRequest('http://localhost:3000/contact', {
        email: 'hello@example.com',
        name: 'Justyn',
      })
    )
  );

  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.error, 'Message required');
});

test('contactAction posts to the backend and returns success', async () => {
  const restore = mock.method(globalThis, 'fetch', async () => {
    return Response.json(
      {
        ok: true,
        submission: { id: 1 },
      },
      { status: 201 }
    );
  });

  try {
    const response = await contactAction(
      makeActionArgs(
        makeRequest('http://localhost:3000/contact', {
          email: 'hello@example.com',
          name: 'Justyn',
          message: 'Please help me ship this starter with confidence.',
        })
      )
    );

    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(payload.ok, true);
    assert.equal(payload.submission.id, 1);
    assert.equal(restore.mock.calls.length, 1);
  } finally {
    restore.mock.restore();
  }
});

test('rootAction redirects to dashboard after successful login', async () => {
  const restore = mock.method(globalThis, 'fetch', async () => {
    return Response.json({ ok: true }, { status: 200 });
  });

  try {
    const response = await rootAction(
      makeActionArgs(
        makeRequest('http://localhost:3000/', {
          email: 'hello@example.com',
        })
      )
    );

    assert.equal(response.status, 302);
    assert.equal(response.headers.get('Location'), 'http://localhost:3000/dashboard');
  } finally {
    restore.mock.restore();
  }
});
