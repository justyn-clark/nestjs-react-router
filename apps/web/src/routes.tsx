import React from 'react';
import type { RouteObject } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Stream } from './components/Stream';
import { Dashboard } from './components/Dashboard';
import { Contact } from './components/Contact';
import { Test } from './components/Test';
import ErrorBoundary from './components/ErrorBoundary';

import { rootLoader, streamLoader, dashboardLoader } from './routes/loaders';
import { rootAction, contactAction } from './routes/actions';

export const routes: RouteObject[] = [
  {
    id: 'root',
    path: '/',
    loader: rootLoader,
    action: rootAction,
    Component: Layout,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        id: 'stream',
        path: 'stream',
        loader: streamLoader,
        Component: Stream,
      },
      {
        id: 'dashboard',
        path: 'dashboard',
        loader: dashboardLoader,
        action: rootAction,
        Component: Dashboard,
      },
      {
        id: 'contact',
        path: 'contact',
        action: contactAction,
        Component: Contact,
      },
      {
        id: 'test',
        path: 'test',
        Component: Test,
      },
    ],
  },
];
