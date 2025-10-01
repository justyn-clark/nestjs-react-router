import * as React from 'react';
import { useLoaderData } from 'react-router-dom';

export function Stream() {
  const data = useLoaderData() as { data: string };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg">📡</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Stream Page</h2>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Streaming Loader Example
        </h3>
        <p className="text-gray-600 mb-4">
          This page demonstrates React Router 7's data loading capabilities. Check the
          Network tab to see the streaming response.
        </p>
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Data loaded successfully: {data.data}</span>
        </div>
      </div>
    </div>
  );
}
