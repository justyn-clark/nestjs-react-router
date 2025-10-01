import * as React from 'react';
import { Outlet, useLoaderData, Form, Link, useNavigation } from 'react-router-dom';

interface LayoutData {
  msg: string;
  user: any;
  message: string | null;
}

export function Layout() {
  const data = useLoaderData() as LayoutData;
  const navigation = useNavigation();

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
          <div className="flex items-center space-x-3">
            {data.user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  Welcome, {data.user.email}
                </span>
                <Form method="post" action="/api/logout">
                  <button
                    type="submit"
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md hover:bg-accent"
                  >
                    Logout
                  </button>
                </Form>
              </div>
            ) : (
              <Form method="post" action="/api/login" className="flex items-center space-x-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email to login"
                  className="px-3 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  disabled={navigation.state === 'submitting'}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors border border-blue-600 rounded-md"
                >
                  {navigation.state === 'submitting' ? 'Logging in...' : 'Login'}
                </button>
              </Form>
            )}
            <a
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border rounded-md hover:bg-accent"
              href="/api/health"
            >
              API Health
            </a>
          </div>
        </header>

        {/* Status Message */}
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">✅ {data.msg}</p>
        </div>

        {/* Login Message */}
        {data.message && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 font-medium">⚠️ {data.message}</p>
          </div>
        )}

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
}
