import type { ActionFunctionArgs } from 'react-router';
import { appUrl } from '../lib/app-url';

export async function rootAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('action');

  if (action === 'logout') {
    try {
      const response = await fetch(appUrl('/auth/logout', request), {
        method: 'POST',
        headers: {
          Cookie: request.headers.get('cookie') || '',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return Response.redirect(new URL('/', request.url).toString());
    } catch (error) {
      if (error instanceof Error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
      return Response.json({ error: 'Logout failed' }, { status: 500 });
    }
  }

  const email = formData.get('email');

  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const response = await fetch(appUrl('/auth/login', request), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json({ error: error.error || 'Login failed' }, { status: 400 });
    }

    return Response.redirect(new URL('/dashboard', request.url).toString());
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}

export async function contactAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get('email');
  const name = formData.get('name');
  const message = formData.get('message');

  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'Email required' }, { status: 400 });
  }

  if (!name || typeof name !== 'string') {
    return Response.json({ error: 'Name required' }, { status: 400 });
  }

  if (!message || typeof message !== 'string') {
    return Response.json({ error: 'Message required' }, { status: 400 });
  }

  const response = await fetch(appUrl('/api/contact', request), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: request.headers.get('cookie') || '',
    },
    body: JSON.stringify({
      email,
      name,
      message,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    return Response.json(
      {
        error: payload?.error?.formErrors?.[0] || payload?.error || 'Contact submission failed',
      },
      { status: response.status }
    );
  }

  return Response.json({ ok: true, submission: payload.submission });
}

export async function dashboardAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('action');

  if (action === 'logout') {
    return Response.redirect(new URL('/', request.url).toString());
  }
}
