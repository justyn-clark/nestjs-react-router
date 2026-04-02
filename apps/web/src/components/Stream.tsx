import * as React from 'react';
import { useLoaderData } from 'react-router-dom';

export function Stream() {
  const data = useLoaderData() as { data: string };

  return (
    <div className="space-y-6">
      <section className="border border-slate-300 p-5">
        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
          Loader example
        </div>
        <h2 className="text-xl font-semibold">Stream page</h2>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          This route shows a plain data-loading surface. The goal is not decoration. The goal is a
          simple place to verify that route-level data loading works and remains easy to inspect.
        </p>
      </section>

      <section className="border border-slate-300 p-5">
        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Loaded data</div>
        <div className="text-sm text-slate-700">Response: {data.data}</div>
      </section>
    </div>
  );
}
