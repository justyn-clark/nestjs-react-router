import * as contactRoute from './modules/contact/routes/contact.route';
import * as dashboardRoute from './modules/dashboard/routes/dashboard.route';
import * as homeRoute from './modules/root/routes/home.route';
import * as rootRoute from './modules/root/routes/root.route';
import * as streamRoute from './modules/stream/routes/stream.route';
import * as testRoute from './modules/test/routes/test.route';
import type { AppRouteConfig } from './routes/config';
import { index, layout, route } from './routes/config';

export const routes = [
  layout(rootRoute, [
    index(homeRoute),
    route('stream', streamRoute),
    route('dashboard', dashboardRoute),
    route('contact', contactRoute),
    route('test', testRoute),
  ]),
] satisfies AppRouteConfig;
