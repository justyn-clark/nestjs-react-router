import * as React from 'react';

const stackRows = [
  ['NestJS', 'HTTP server, SSR orchestration, route endpoints, queue wiring'],
  ['React Router 7', 'UI routing, loaders, actions, protected views, SSR entry'],
  ['PostgreSQL + Drizzle', 'persistent application data and explicit schema ownership'],
  ['Redis + BullMQ', 'sessions, queue state, and async execution seams'],
  ['pnpm + Turbo', 'workspace structure and deterministic verification flow'],
];

const principles = [
  'Keep the shell plain so product teams can extend it without fighting a visual style.',
  'Keep runtime seams visible so agents and engineers can infer how the application works.',
  'Keep verification explicit so changes can be proven, not narrated.',
];

export function Home() {
  return (
    <div className="space-y-6">
      <section className="grid gap-px border border-slate-300 bg-slate-300 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-white p-5 sm:p-6">
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Overview</div>
          <h2 className="text-2xl font-semibold tracking-tight">
            A functional base for modern application work.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            This starter is intentionally structural, not decorative. It gives you a verified app
            shell, route modules, data boundaries, SSR, and infrastructure seams that are meant to
            be expanded into real products without first undoing generated nonsense.
          </p>
        </div>

        <div className="bg-white p-5 sm:p-6">
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Quick start</div>
          <pre className="overflow-x-auto border border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {'cp .env.example .env\npnpm install\npnpm db:push\npnpm dev'}
          </pre>
        </div>
      </section>

      <section className="border border-slate-300">
        <div className="border-b border-slate-300 px-5 py-3 text-xs uppercase tracking-[0.18em] text-slate-500">
          Stack map
        </div>
        <div className="divide-y divide-slate-300">
          {stackRows.map(([name, description]) => (
            <div key={name} className="grid gap-3 px-5 py-4 md:grid-cols-[180px_minmax(0,1fr)]">
              <div className="text-sm font-medium text-slate-900">{name}</div>
              <div className="text-sm leading-6 text-slate-600">{description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="border border-slate-300 p-5">
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
            Design intent
          </div>
          <ul className="space-y-3 text-sm leading-6 text-slate-600">
            {principles.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="border border-slate-300 p-5">
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Read next</div>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <a
                className="underline underline-offset-2"
                href="https://github.com/justyn-clark/nestjs-react-router/blob/main/docs/architecture.md"
              >
                Architecture
              </a>
            </li>
            <li>
              <a
                className="underline underline-offset-2"
                href="https://github.com/justyn-clark/nestjs-react-router/blob/main/docs/local-development.md"
              >
                Local development
              </a>
            </li>
            <li>
              <a
                className="underline underline-offset-2"
                href="https://github.com/justyn-clark/nestjs-react-router/blob/main/docs/agent-legibility.md"
              >
                Agent legibility
              </a>
            </li>
            <li>
              <a
                className="underline underline-offset-2"
                href="https://github.com/justyn-clark/nestjs-react-router/blob/main/docs/tech-stack-map.md"
              >
                Tech stack map
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
