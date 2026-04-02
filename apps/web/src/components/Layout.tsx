import * as React from 'react';
import {
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigation,
} from 'react-router';
import type { ActivityEvent, ControlPlaneSummary, TaskRun } from '../lib/control-plane';
import { ActivityFeed } from './ActivityFeed';
import { CommandPalette } from './CommandPalette';
import { TaskRuns } from './TaskRuns';

interface LayoutData {
  msg: string;
  user: { email: string } | null;
  message: string | null;
  controlPlane: ControlPlaneSummary;
}

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/stream', label: 'Data' },
  { to: '/contact', label: 'Forms' },
  { to: '/dashboard', label: 'Protected' },
  { to: '/test', label: 'Client' },
];

function NavLinkItem({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      className={`inline-flex min-h-10 items-center border px-3 text-sm ${
        active
          ? 'border-slate-900 bg-slate-900 text-white'
          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
      }`}
      to={to}
    >
      {label}
    </Link>
  );
}

export function Layout() {
  const data = useLoaderData() as LayoutData;
  const navigation = useNavigation();
  const location = useLocation();
  const actionData = useActionData() as { error?: string } | undefined;
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [activity, setActivity] = React.useState<ActivityEvent[]>(data.controlPlane.activity);
  const [tasks, setTasks] = React.useState<TaskRun[]>(data.controlPlane.tasks);

  React.useEffect(() => {
    function openPalette() {
      setPaletteOpen(true);
    }

    window.addEventListener('starter-command-palette:open', openPalette);
    return () => window.removeEventListener('starter-command-palette:open', openPalette);
  }, []);

  React.useEffect(() => {
    const source = new EventSource('/api/control-plane/events');

    source.onmessage = (event) => {
      const payload = JSON.parse(event.data) as
        | { kind?: 'activity'; event?: ActivityEvent }
        | { kind?: 'task'; task?: TaskRun }
        | { type?: 'hello' };

      if ('kind' in payload && payload.kind === 'activity' && payload.event) {
        const nextEvent = payload.event;
        setActivity((current) => [nextEvent, ...current].slice(0, 12));
      }

      if ('kind' in payload && payload.kind === 'task' && payload.task) {
        const nextTask = payload.task;
        setTasks((current) => {
          const next = [nextTask, ...current.filter((task) => task.id !== nextTask.id)];
          return next.slice(0, 12);
        });
      }
    };

    return () => source.close();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        commands={data.controlPlane.commands}
      />

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="border border-slate-300">
          <header className="border-b border-slate-300">
            <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="border-b border-slate-300 p-5 lg:border-b-0 lg:border-r">
                <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                  JCN starter system
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">NestJS React Router</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  Wireframe-clean full-stack starter with SSR, route modules, PostgreSQL, Redis,
                  deterministic verification, and explicit seams for real application growth.
                </p>
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <span>Session surface</span>
                  <button
                    type="button"
                    onClick={() => setPaletteOpen(true)}
                    className="border border-slate-300 px-2 py-1 text-[11px] text-slate-700 hover:bg-slate-50"
                  >
                    / Commands
                  </button>
                </div>
                {data.user ? (
                  <div className="space-y-3">
                    <div className="border border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                      Signed in as {data.user.email}
                    </div>
                    <Form action="/" method="post">
                      <input type="hidden" name="action" value="logout" />
                      <button
                        type="submit"
                        className="inline-flex min-h-10 items-center border border-slate-900 bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
                      >
                        Logout
                      </button>
                    </Form>
                  </div>
                ) : (
                  <Form method="post" action="/" className="space-y-3">
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="min-h-10 w-full border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
                      required
                    />
                    <button
                      type="submit"
                      disabled={navigation.state === 'submitting'}
                      className="inline-flex min-h-10 items-center border border-slate-900 bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      {navigation.state === 'submitting' ? 'Starting session...' : 'Demo login'}
                    </button>
                  </Form>
                )}
              </div>
            </div>
          </header>

          <div className="grid gap-0 xl:grid-cols-[220px_minmax(0,1fr)_340px]">
            <aside className="border-b border-slate-300 p-4 xl:border-b-0 xl:border-r">
              <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                Navigation
              </div>
              <nav className="flex flex-wrap gap-2 xl:flex-col">
                {navItems.map((item) => (
                  <NavLinkItem
                    key={item.to}
                    to={item.to}
                    label={item.label}
                    active={
                      item.to === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(item.to)
                    }
                  />
                ))}
              </nav>

              <div className="mt-6 space-y-2">
                <a
                  className="block border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  href="/api/health"
                >
                  API health
                </a>
                <a
                  className="block border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  href="https://github.com/justyn-clark/nestjs-react-router"
                >
                  Repository
                </a>
              </div>
            </aside>

            <section>
              <div className="border-b border-slate-300 px-5 py-3 text-sm text-slate-600">
                {data.msg}
              </div>

              {data.message && (
                <div className="border-b border-amber-300 bg-amber-50 px-5 py-3 text-sm text-amber-900">
                  {data.message}
                </div>
              )}

              {actionData?.error && (
                <div className="border-b border-red-300 bg-red-50 px-5 py-3 text-sm text-red-900">
                  {actionData.error}
                </div>
              )}

              <main className="p-5 sm:p-6">
                <Outlet />
              </main>
            </section>

            <aside className="border-t border-slate-300 p-5 xl:border-l xl:border-t-0">
              <div className="mb-4 text-xs uppercase tracking-[0.18em] text-slate-500">
                Control plane
              </div>
              <div className="space-y-4">
                <TaskRuns tasks={tasks} />
                <ActivityFeed events={activity} />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
