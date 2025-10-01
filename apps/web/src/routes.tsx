import type { RouteObject } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Stream } from './components/Stream';
import { Dashboard } from './components/Dashboard';
import { Contact } from './components/Contact';
import { Test } from './components/Test';

export const routes: RouteObject[] = [
  {
    id: 'root',
    path: '/',
    loader: async ({ request }) => {
      const url = new URL(request.url);
      const me = await fetch(url.origin + '/api/me', {
        headers: { cookie: request.headers.get('cookie') || '' },
      });
      const userData = await me.json();
      return Response.json({ 
        msg: 'hello from RR7 (loader via Nest SSR)',
        user: userData.user,
        message: url.searchParams.get('message')
      });
    },
    Component: Layout,
    children: [
      {
        path: '/',
        Component: Home,
      },
      {
        path: '/stream',
        loader: async () => {
          await new Promise((r) => setTimeout(r, 200));
          return Response.json({ data: 'chunked!' });
        },
        Component: Stream,
      },
      {
        path: '/dashboard',
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const me = await fetch(url.origin + '/api/me', {
            headers: { cookie: request.headers.get('cookie') || '' },
          });
          const data = await me.json();
          if (!data.user) {
            const homeUrl = new URL('/', url.origin);
            homeUrl.searchParams.set('message', 'Please login to access the dashboard');
            return Response.redirect(homeUrl.toString(), 302);
          }
          return data;
        },
        Component: Dashboard,
      },
      {
        path: '/contact',
        action: async ({ request }) => {
          const form = await request.formData();
          const email = form.get('email');
          if (!email) return new Response('Email required', { status: 400 });
          return Response.json({ ok: true });
        },
        Component: Contact,
      },
      {
        path: '/test',
        Component: Test,
      },
    ],
  },
];