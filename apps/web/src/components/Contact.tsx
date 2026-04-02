import * as React from 'react';
import { Form, useActionData } from 'react-router-dom';

export function Contact() {
  const res = useActionData() as { ok?: boolean; error?: string } | undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="border border-slate-300 p-5">
        <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Form boundary</div>
        <h2 className="text-xl font-semibold">Contact flow</h2>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          This route demonstrates a plain but real application seam: collect input in the web layer,
          validate it, send it to the backend, and persist it in PostgreSQL.
        </p>
      </section>

      <section className="border border-slate-300 p-5">
        <div className="mb-5">
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">Submission</div>
          <h3 className="text-lg font-semibold">Submit a message</h3>
        </div>

        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-900">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Jane Doe"
              className="min-h-10 w-full border border-slate-300 px-3 text-slate-900 outline-none focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-900">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="min-h-10 w-full border border-slate-300 px-3 text-slate-900 outline-none focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-900">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Describe what you want to build or support."
              rows={6}
              className="w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex min-h-10 items-center border border-slate-900 bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800"
          >
            Save submission
          </button>

          {res?.ok && (
            <div className="border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900">
              Submission saved successfully.
            </div>
          )}
          {res?.error && (
            <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
              {res.error}
            </div>
          )}
        </Form>
      </section>
    </div>
  );
}
