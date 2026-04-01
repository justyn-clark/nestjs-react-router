import * as React from 'react';

const sections = [
  {
    title: 'Included',
    items: [
      'NestJS on Fastify',
      'React Router 7 SSR bridge',
      'Redis-backed sessions',
      'PostgreSQL via Drizzle',
      'BullMQ demo queue wiring',
    ],
  },
  {
    title: 'Verified',
    items: [
      'Health endpoint checks Redis and PostgreSQL',
      'Contact submissions persist to PostgreSQL',
      'Route loaders and actions have test coverage',
      'Workspace builds and typechecks cleanly',
    ],
  },
  {
    title: 'Replace next',
    items: [
      'Demo auth with your real auth provider',
      'Starter copy with product-specific content',
      'Demo queue jobs with app workflows',
      'Contact storage with CRM or support routing',
    ],
  },
];

export function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">Starter overview</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">
          This template is meant to give you a working full-stack base without turning the homepage
          into a marketing site. It is intentionally simple: app shell, session flow, SSR routing,
          infrastructure hooks, and a few real endpoints you can extend.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900">
              {section.title}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {section.items.map((item) => (
                <li key={item} className="border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900">
          Quick start
        </h3>
        <pre className="overflow-x-auto text-sm leading-6 text-slate-700">{`cp .env.example .env
pnpm install
pnpm db:push
pnpm dev`}</pre>
      </section>
    </div>
  );
}
