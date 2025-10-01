
import * as React from 'react';
import { type RouteObject } from 'react-router';
import { Outlet, useLoaderData, Form, useActionData, Link } from 'react-router-dom';

export const routes: RouteObject[] = [
  {
    id: "root",
    path: "/",
    loader: async () => {
      return Response.json({ msg: "hello from RR7 (loader via Nest SSR)" });
    },
    Component() {
      const data = useLoaderData() as { msg: string };
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <header className="flex items-center justify-between mb-8 pb-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RR</span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  React Router 7 + NestJS
                </h1>
              </div>
              <a
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md hover:bg-accent"
                href="/api/health"
              >
                API Health
              </a>
            </header>

            {/* Status Message */}
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                ✅ {data.msg}
              </p>
            </div>

            {/* Navigation */}
            <nav className="mb-8">
              <div className="flex flex-wrap gap-2">
                <Link
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                  to="/"
                >
                  🏠 Home
                </Link>
                <Link
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                  to="/stream"
                >
                  📡 Stream
                </Link>
                <Link
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                  to="/contact"
                >
                  📧 Contact
                </Link>
                <Link
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                  to="/dashboard"
                >
                  📊 Dashboard
                </Link>
                <Link
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                  to="/test"
                >
                  🧪 Test
                </Link>
              </div>
            </nav>

            {/* Main Content */}
            <main className="bg-card border border-border rounded-xl shadow-sm p-6">
              <Outlet />
            </main>
          </div>
        </div>
      );
    },
    children: [
      {
        path: "/",
        Component() {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Welcome to React Router 7 + NestJS
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  A modern full-stack application with server-side rendering, client-side navigation, and beautiful UI.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Server-Side Rendering</h3>
                  <p className="text-gray-600">Fast initial page loads with SSR powered by NestJS and React Router 7.</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🔄</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Navigation</h3>
                  <p className="text-gray-600">Smooth client-side navigation without page refreshes.</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-white text-xl">🎨</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Beautiful UI</h3>
                  <p className="text-gray-600">Modern design with Tailwind CSS and thoughtful interactions.</p>
                </div>
              </div>
            </div>
          )
        }
      },
      {
        path: "/stream",
        loader: async () => {
          const data = (async () => {
            await new Promise(r => setTimeout(r, 200));
            return "chunked!";
          })();
          return Response.json({ data: "chunked!" });
        },
        Component() {
          return (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📡</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Stream Page</h2>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Streaming Loader Example</h3>
                <p className="text-gray-600 mb-4">
                  This page demonstrates React Router 7's data loading capabilities.
                  Check the Network tab to see the streaming response.
                </p>
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Data loaded successfully with 200ms delay</span>
                </div>
              </div>
            </div>
          )
        }
      },

      {
        path: "/dashboard",
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const me = await fetch(url.origin + "/api/me", { headers: { cookie: request.headers.get("cookie") || "" } });
          const data = await me.json();
          if (!data.user) {
            return Response.redirect("/", 302);
          }
          return data;
        },
        Component() {
          const data = (useLoaderData() as any);
          return <div className="space-y-2"><h2 className="text-xl font-semibold">Dashboard</h2><p>Welcome, {data.user.email}</p></div>;
        }
      },

      {
        path: "/contact",
        action: async ({ request }) => {
          const form = await request.formData();
          const email = form.get("email");
          if (!email) return new Response("Email required", { status: 400 });
          return Response.json({ ok: true });
        },
        Component() {
          const res = useActionData() as any;
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
                      <p className="text-sm text-green-800 font-medium">✅ Thanks! Your message has been sent.</p>
                    </div>
                  )}
                </Form>
              </div>
            </div>
          )
        }
      },

      {
        path: "/test",
        Component() {
          return (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🧪</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Test Page</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ Client-Side Navigation</h3>
                  <p className="text-gray-600">Navigation works without page refreshes.</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ Server-Side Rendering</h3>
                  <p className="text-gray-600">Pages are rendered on the server for fast initial loads.</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ Tailwind CSS</h3>
                  <p className="text-gray-600">Beautiful styling with utility-first CSS framework.</p>
                </div>

                <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ React Router 7</h3>
                  <p className="text-gray-600">Modern routing with data loading and actions.</p>
                </div>
              </div>
            </div>
          );
        }
      }
    ]
  }
];
