import { hydrateRoot } from 'react-dom/client';
import type { HydrationState, RouteObject } from 'react-router';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import { routes } from './routes.js';

declare global {
  var __staticRouterHydrationData: HydrationState | undefined;
}

const hydrationData = window.__staticRouterHydrationData;

const router = createBrowserRouter(routes, {
  hydrationData,
});

const rootElement = document.getElementById('root');
if (rootElement) {
  hydrateRoot(rootElement, <RouterProvider router={router} />);
}

if (import.meta.hot) {
  import.meta.hot.accept('./routes', (module) => {
    const nextRoutes = (module as { routes?: RouteObject[] } | undefined)?.routes;

    if (nextRoutes) {
      const newRouter = createBrowserRouter(nextRoutes, {
        hydrationData,
      });

      const currentRootElement = document.getElementById('root');
      if (currentRootElement) {
        hydrateRoot(currentRootElement, <RouterProvider router={newRouter} />);
      }
    }
  });
}
