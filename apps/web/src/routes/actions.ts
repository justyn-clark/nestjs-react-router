import type { ActionFunctionArgs } from 'react-router';
import { appUrl } from '../lib/app-url';

const contactFieldLabels: Record<string, string> = {
  email: 'Email address',
  name: 'Name',
  message: 'Message',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getContactErrorMessage(payload: unknown) {
  if (!isRecord(payload)) {
    return 'Contact submission failed. Please try again.';
  }

  const error = payload.error;

  if (typeof error === 'string') {
    return error;
  }

  if (!isRecord(error)) {
    return 'Contact submission failed. Please try again.';
  }

  const formErrors = error.formErrors;

  if (Array.isArray(formErrors)) {
    const formError = formErrors.find((item): item is string => typeof item === 'string');

    if (formError) {
      return formError;
    }
  }

  const fieldErrors = error.fieldErrors;

  if (isRecord(fieldErrors)) {
    const messages = Object.entries(fieldErrors).flatMap(([field, value]) => {
      if (!Array.isArray(value)) {
        return [];
      }

      const message = value.find((item): item is string => typeof item === 'string');
      return message ? [`${contactFieldLabels[field] || field}: ${message}`] : [];
    });

    if (messages.length) {
      return `Please check the form. ${messages.join(' ')}`;
    }
  }

  return 'Contact submission failed. Please try again.';
}

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

  try {
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

    const payload = (await response.json().catch(() => null)) as unknown;

    if (!response.ok) {
      return Response.json(
        {
          error: getContactErrorMessage(payload),
        },
        { status: response.status }
      );
    }

    return Response.json({ ok: true, submission: isRecord(payload) ? payload.submission : null });
  } catch {
    return Response.json(
      { error: 'Contact submission failed. Please check your connection and try again.' },
      { status: 503 }
    );
  }
}

export async function dashboardAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('action');

  if (action === 'logout') {
    return Response.redirect(new URL('/', request.url).toString());
  }
}
