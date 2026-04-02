import * as React from 'react';

const checks = [
  'Client-side hydration',
  'Interactive state updates',
  'SSR shell handoff',
  'Route-level UI continuity',
];

export function Test() {
  const [count, setCount] = React.useState(0);
  const [clientSide, setClientSide] = React.useState(false);

  React.useEffect(() => {
    setClientSide(true);
  }, []);

  return (
    <div className="space-y-6">
      <section className="border border-slate-300 p-5">
        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
          Client behavior
        </div>
        <h2 className="text-xl font-semibold">Test page</h2>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          This page exists to prove the starter can hand off from SSR to live client behavior
          without pretending to be a product surface.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="border border-slate-300 p-5">
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">State</div>
          <p className="mb-4 text-sm text-slate-700">
            Status: {clientSide ? 'Client is active.' : 'Waiting for hydration.'}
          </p>
          <button
            type="button"
            onClick={() => setCount(count + 1)}
            className="inline-flex min-h-10 items-center border border-slate-900 bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            Increment
          </button>
          <div className="mt-4 text-sm text-slate-700">Count: {count}</div>
        </div>

        <div className="border border-slate-300 p-5">
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Checks</div>
          <ul className="space-y-3 text-sm leading-6 text-slate-600">
            {checks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
