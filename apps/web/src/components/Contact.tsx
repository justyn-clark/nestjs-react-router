import * as React from 'react';
import { Form, useActionData } from 'react-router-dom';

export function Contact() {
  const res = useActionData() as { ok?: boolean; error?: string } | undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">📧</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
      </div>

      <div className="max-w-md">
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
          >
            Send Message
          </button>

          {res?.ok && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800 font-medium">
                ✅ Thanks! Your message has been sent.
              </p>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}
