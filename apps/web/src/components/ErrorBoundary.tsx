import React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router';

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen bg-white px-4 py-8 text-slate-950">
        <div className="mx-auto max-w-2xl border border-slate-300 p-6">
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Route error</div>
          <h1 className="text-2xl font-semibold">
            {error.status} {error.statusText}
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            {String(error.data ?? 'The route returned an error response.')}
          </p>
          <a
            href="/"
            className="mt-6 inline-flex min-h-10 items-center border border-slate-900 bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            Go back home
          </a>
        </div>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="min-h-screen bg-white px-4 py-8 text-slate-950">
        <div className="mx-auto max-w-2xl border border-slate-300 p-6">
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">
            Runtime error
          </div>
          <h1 className="text-2xl font-semibold">Application error</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">{error.message}</p>
          <a
            href="/"
            className="mt-6 inline-flex min-h-10 items-center border border-slate-900 bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            Go back home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-slate-950">
      <div className="mx-auto max-w-2xl border border-slate-300 p-6">
        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Unknown error</div>
        <h1 className="text-2xl font-semibold">Something unexpected happened</h1>
        <a
          href="/"
          className="mt-6 inline-flex min-h-10 items-center border border-slate-900 bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
