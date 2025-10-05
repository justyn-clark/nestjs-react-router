import type { ActionFunctionArgs } from 'react-router';

export async function rootAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('action');

  // Handle logout
  if (action === 'logout') {
    try {
      const response = await fetch(new URL('/auth/logout', request.url).toString(), {
        method: 'POST',
        headers: {
          Cookie: request.headers.get('cookie') || '',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return Response.redirect('/');
    } catch (error) {
      if (error instanceof Error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
      return Response.json({ error: 'Logout failed' }, { status: 500 });
    }
  }

  // Handle login
  const email = formData.get('email');

  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const response = await fetch(new URL('/auth/login', request.url).toString(), {
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

    // Redirect to dashboard on successful login
    return Response.redirect('/dashboard');
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

  if (!email || typeof email !== 'string') {
    return Response.json({ error: 'Email required' }, { status: 400 });
  }

  // TODO: Implement contact form submission logic
  return Response.json({ ok: true });
}

export async function dashboardAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('action');

  if (action === 'logout') {
    return Response.redirect('/');
  }
}
