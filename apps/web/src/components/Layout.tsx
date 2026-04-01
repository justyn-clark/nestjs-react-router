import * as React from 'react';
import { Form, Link, Outlet, useActionData, useLoaderData, useNavigation } from 'react-router';

interface LayoutData {
  msg: string;
  user: { email: string } | null;
  message: string | null;
}

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/stream', label: 'Stream' },
  { to: '/contact', label: 'Contact' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/test', label: 'Test' },
];

export function Layout() {
  const data = useLoaderData() as LayoutData;
  const navigation = useNavigation();
  const actionData = useActionData() as { error?: string } | undefined;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="mb-6 border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">NestJS React Router</h1>
                <p className="text-sm text-slate-600">
                  Functional starter for SSR, sessions, PostgreSQL, and shared workspace packages.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:min-w-[320px]">
                {data.user ? (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <div className="border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      Signed in as {data.user.email}
                    </div>
                    <Form action="/" method="post">
                      <input type="hidden" name="action" value="logout" />
                      <button
                        type="submit"
                        className="border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Logout
                      </button>
                    </Form>
                  </div>
                ) : (
                  <Form method="post" action="/" className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="min-w-0 flex-1 border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500"
                      required
                    />
                    <button
                      type="submit"
                      disabled={navigation.state === 'submitting'}
                      className="bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      {navigation.state === 'submitting' ? 'Starting session...' : 'Demo login'}
                    </button>
                  </Form>
                )}

                <div className="flex gap-2 lg:justify-end">
                  <a
                    className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    href="/api/health"
                  >
                    API health
                  </a>
                  <a
                    className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    href="https://github.com/justyn-clark/nestjs-react-router"
                  >
                    Repo
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  to={item.to}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="text-sm text-slate-600">{data.msg}</div>
          </div>
        </header>

        {data.message && (
          <div className="mb-4 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {data.message}
          </div>
        )}

        {actionData?.error && (
          <div className="mb-4 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
            {actionData.error}
          </div>
        )}

        <main className="border border-slate-200 bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
