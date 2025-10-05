import * as React from 'react';

export function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Welcome to React Router 7 + NestJS
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          A modern full-stack application with server-side rendering, client-side navigation, and
          beautiful UI.
        </p>
        <p className="text-lg text-green-600 font-semibold">
          🔥 Hot Module Replacement is working! (Updated at {new Date().toLocaleTimeString()}) -
          Test 8
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-white text-xl">⚡</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Server-Side Rendering</h3>
          <p className="text-gray-600">
            Fast initial page loads with SSR powered by NestJS and React Router 7.
          </p>
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
          <p className="text-gray-600">
            Modern design with Tailwind CSS and thoughtful interactions.
          </p>
        </div>
      </div>
    </div>
  );
}
