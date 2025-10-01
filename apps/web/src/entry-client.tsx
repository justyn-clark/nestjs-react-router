import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import './index.css';

// Get hydration data from the server
declare global {
  var __staticRouterHydrationData: any;
}

const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

hydrateRoot(document.getElementById('root')!, <RouterProvider router={router} />);
