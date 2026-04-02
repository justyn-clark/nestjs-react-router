import type { LoaderFunctionArgs } from 'react-router';
import { appUrl } from '../lib/app-url';
import type { ControlPlaneSummary } from '../lib/control-plane';

export async function rootLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const [me, controlPlane] = await Promise.all([
    fetch(appUrl('/auth/me', request), {
      headers: { cookie: request.headers.get('cookie') || '' },
    }),
    fetch(appUrl('/api/control-plane/summary', request)),
  ]);
  const userData = await me.json();
  const summary = (await controlPlane.json()) as ControlPlaneSummary;

  return Response.json({
    msg: 'SSR, sessions, Redis, PostgreSQL, and shared packages are wired and running.',
    user: userData.user,
    message: url.searchParams.get('message'),
    controlPlane: summary,
  });
}

export async function streamLoader() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return Response.json({ data: 'chunked!' });
}

export async function dashboardLoader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const me = await fetch(appUrl('/auth/me', request), {
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
