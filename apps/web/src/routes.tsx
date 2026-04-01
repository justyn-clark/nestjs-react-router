import React from 'react';
import type { RouteObject } from 'react-router';
import { Contact } from './components/Contact';
import { Dashboard } from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { Home } from './components/Home';
import { Layout } from './components/Layout';
import { Stream } from './components/Stream';
import { Test } from './components/Test';

import { contactAction, rootAction } from './routes/actions';
import { dashboardLoader, rootLoader, streamLoader } from './routes/loaders';

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
