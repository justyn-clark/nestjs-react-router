import * as React from 'react';
import { useLoaderData } from 'react-router-dom';

interface DashboardData {
  user: {
    email: string;
  };
}

const nextSteps = [
  'Replace demo auth with your real auth provider.',
  'Add your domain data and app routes.',
  'Swap demo queue behavior for background jobs that matter to your product.',
];

export function Dashboard() {
  const data = useLoaderData() as DashboardData;

  return (
    <div className="space-y-6">
      <section className="border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-950">Dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">Authenticated as {data.user.email}</p>
      </section>

      <section className="border border-slate-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900">
          Suggested next steps
        </h3>
        <ul className="space-y-2 text-sm text-slate-600">
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
