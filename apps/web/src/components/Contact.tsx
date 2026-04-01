import * as React from 'react';
import { Form, useActionData } from 'react-router-dom';

export function Contact() {
  const res = useActionData() as { ok?: boolean; error?: string } | undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-semibold text-slate-950">Contact flow</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This route exists to prove the starter can accept validated input from the app layer and
          persist a record through the backend into PostgreSQL.
        </p>
      </section>

      <section className="border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-950">Submit a message</h3>
          <p className="mt-2 text-sm text-slate-600">
            Replace this with lead capture, support intake, or another workflow for your app.
          </p>
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
              className="w-full border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
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
              className="w-full border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
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
              className="w-full border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
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
