import * as React from 'react';

export function Test() {
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            ✅ Client-Side Navigation
          </h3>
          <p className="text-gray-600">Navigation works without page refreshes.</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            ✅ Server-Side Rendering
          </h3>
          <p className="text-gray-600">
            Pages are rendered on the server for fast initial loads.
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ Tailwind CSS</h3>
          <p className="text-gray-600">
            Beautiful styling with utility-first CSS framework.
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ React Router 7</h3>
          <p className="text-gray-600">
            Modern routing with data loading and server-side rendering.
          </p>
        </div>
      </div>
    </div>
  );
}
