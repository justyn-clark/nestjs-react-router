import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import './index.css';

// Get hydration data from the server
declare global {
  var __staticRouterHydrationData: unknown;
}

const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

const rootElement = document.getElementById('root');
if (rootElement) {
  hydrateRoot(rootElement, <RouterProvider router={router} />);
}

// Enable HMR for React components
if (import.meta.hot) {
  import.meta.hot.accept('./routes', (newRoutes) => {
    if (newRoutes) {
      // Recreate router with new routes
      const newRouter = createBrowserRouter(newRoutes.routes, {
        hydrationData: window.__staticRouterHydrationData,
      });

      // Re-render with new router
      const rootElement = document.getElementById('root');
      if (rootElement) {
        hydrateRoot(rootElement, <RouterProvider router={newRouter} />);
      }
    }
  });
}
