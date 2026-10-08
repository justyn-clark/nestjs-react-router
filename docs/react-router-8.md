# React Router 8 migration

The starter uses React Router 8.4, React/React DOM 19.3, and Vite 8.3. The package manifests declare compatible ranges; `pnpm-lock.yaml` pins the resolved versions for reproducible installs.

## Runtime requirements

- Node.js 22.22.0 or newer is required by the root `engines` field.
- Node.js 24 LTS is recommended; `.nvmrc` and both Dockerfiles select Node 24.
- pnpm 9.7.0 is pinned in the root `packageManager` field.
- CI verifies Node 22.22.0 and Node 24.

With nvm installed, run `nvm install && nvm use` from the repository root before installing dependencies.

## Router integration

The application uses Data APIs with a custom NestJS/Fastify SSR host. The route manifest and feature modules keep their existing structure:

- `apps/web/src/entry-server.tsx` queries `createStaticHandler`, builds a `createStaticRouter`, renders `StaticRouterProvider`, and includes loader data for hydration.
- `apps/web/src/entry-client.tsx` creates the browser router with that hydration data and mounts `RouterProvider`.
- Nest serves the HTML and built browser assets; API and auth endpoints remain Nest controllers.

`react-router-dom` has been removed. Import `createBrowserRouter`, `Form`, `Link`, and route hooks/types from `react-router`; import the browser `RouterProvider` from `react-router/dom`.

Loader/action arguments use the stable `url` and `pattern` fields. Context is provided through `RouterContextProvider`; the test fixtures use the same API. The starter does not pass custom request context from Nest or define router middleware.

Framework-mode future flags, split route-module configuration, and `.data` request rewrites do not apply to this Data API bridge. It does not use `@react-router/dev` or a React Router Vite plugin. See the [official v8 upgrade guide](https://reactrouter.com/upgrading/v7) when extending the integration.

## Build and verification

Vite 8 uses `build.rolldownOptions`. The React and Tailwind plugins have been updated for Vite 8 compatibility. The browser bundle still lands in `apps/web/dist/client`, and the Nest build still compiles the server-side route tree under `apps/server/dist`.

```bash
pnpm install --frozen-lockfile
pnpm verify
pnpm start
```

With the built app and PostgreSQL/Redis running, use another terminal:

```bash
pnpm test:e2e
```

Set `SMOKE_BASE_URL` if the app uses a port other than 3000. `pnpm verify` covers lint and formatting, route actions/loaders, SSR rendering and hydration data, session-cookie forwarding, protected-route redirects, shared schemas, workspace typechecks, and builds. The running-app smoke test covers health, persistence, login, and the authenticated dashboard.
