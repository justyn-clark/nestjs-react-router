import * as React from 'react';
import { useLoaderData } from 'react-router-dom';

export function Dashboard() {
  const data = useLoaderData() as { user: { email: string } };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <p>Welcome, {data.user.email}</p>
    </div>
  );
}
