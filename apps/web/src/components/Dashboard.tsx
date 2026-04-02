import * as React from 'react';
import { useLoaderData } from 'react-router-dom';

interface DashboardData {
  user: {
    email: string;
  };
}

const nextSteps = [
  'Replace demo auth with your real auth provider.',
  'Introduce domain data and route modules by feature.',
  'Turn queue seams into real background work.',
];

export function Dashboard() {
  const data = useLoaderData() as DashboardData;

  return (
    <div className="space-y-6">
      <section className="border border-slate-300 p-5">
        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
          Protected surface
        </div>
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="mt-4 text-sm leading-6 text-slate-600">Authenticated as {data.user.email}</p>
      </section>

      <section className="border border-slate-300 p-5">
        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
          Suggested next steps
        </div>
        <ul className="space-y-3 text-sm leading-6 text-slate-600">
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
