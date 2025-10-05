import type { LoaderFunctionArgs } from 'react-router';

export async function rootLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const me = await fetch(`${url.origin}/auth/me`, {
    headers: { cookie: request.headers.get('cookie') || '' },
  });
  const userData = await me.json();

  return Response.json({
    msg: 'hello from RR7 (loader via Nest SSR)',
    user: userData.user,
    message: url.searchParams.get('message'),
  });
}

export async function streamLoader() {
  // Simulate async data loading
  await new Promise((r) => setTimeout(r, 200));
  return Response.json({ data: 'chunked!' });
}

export async function dashboardLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const me = await fetch(`${url.origin}/auth/me`, {
    headers: { cookie: request.headers.get('cookie') || '' },
  });
  const data = await me.json();

  if (!data.user) {
    const homeUrl = new URL('/', url.origin);
    homeUrl.searchParams.set('message', 'Please login to access the dashboard');
    return Response.redirect(homeUrl.toString());
  }

  return Response.json(data);
}
