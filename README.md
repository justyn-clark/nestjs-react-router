<div align="center">

# NestJS React Router

<p align="center">
  <a href="https://github.com/justyn-clark/nestjs-react-router/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/justyn-clark/nestjs-react-router/ci.yml?branch=main&label=ci"></a>
  <a href="https://github.com/justyn-clark/nestjs-react-router/releases"><img alt="Release" src="https://img.shields.io/github/v/release/justyn-clark/nestjs-react-router?display_name=tag"></a>
  <a href="https://github.com/justyn-clark/nestjs-react-router/tags"><img alt="Tag" src="https://img.shields.io/github/v/tag/justyn-clark/nestjs-react-router"></a>
  <a href="./LICENSE"><img alt="License" src="https://img.shields.io/github/license/justyn-clark/nestjs-react-router"></a>
  <a href="#runtime-architecture"><img alt="Stack" src="https://img.shields.io/badge/stack-NestJS%20%7C%20React%20Router%207%20%7C%20PostgreSQL%20%7C%20Redis-0f172a"></a>
</p>

<p align="center">
  <img src="assets/logos/nestjs-logo.svg" alt="NestJS Logo" width="120" height="120"/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="assets/logos/rr_logo_light.svg" alt="React Router Logo" width="120" height="120"/>
</p>

A starter monorepo that wires a NestJS server to a React Router 7 app with server-side rendering, Redis-backed session state, PostgreSQL persistence, and shared workspace packages.

</div>

## Status

This repo is intended to be a truthful, opinionated starter rather than a flashy scaffold.

Included today:
- NestJS 10 on Fastify
- React 18 + React Router 7 SSR bridge
- Turborepo + pnpm workspace layout
- Tailwind CSS 4 in the web app
- Drizzle ORM package for PostgreSQL access
- Redis-backed sessions and BullMQ demo queue
- Contact form submission persisted to PostgreSQL
- Health endpoint that checks both Redis and PostgreSQL
- Checked-in CI workflow
- `docs/` directory, devcontainer config, and explicit MIT license
- end-to-end smoke coverage against a running built app

Still intentionally minimal:
- auth is session-demo auth, not a production identity system
- queue processing is demo-level scaffolding
- the starter favors deterministic verification over aggressive build caching

## What this starter is

- A server-rendered full-stack app where NestJS hosts and renders the React Router app
- A monorepo with explicit seams for server logic, web UI, persistence, Redis-backed state, and shared schemas
- A starter that tries to stay legible to both humans and agents

## What this starter is not

- Two independently deployed applications pretending to be one product
- A design-forward marketing shell
- A fully finished auth system
- A queue platform with production workflows already built in

## Repository Layout

```text
nestjs-react-router/
├── .devcontainer/             # Devcontainer setup
├── .github/workflows/         # CI workflow
├── apps/
│   ├── server/                # NestJS + Fastify server and SSR bridge
│   └── web/                   # React Router 7 app built with Vite
├── docs/                      # Architecture, local-dev, release, and agent-legibility docs
├── packages/
│   ├── db/                    # Drizzle/PostgreSQL package
│   ├── redis/                 # Shared Redis client
│   └── shared/                # Shared helpers and schemas
├── assets/                    # README assets/logos
├── scripts/                   # Smoke and e2e verification helpers
├── docker-compose.yml
├── Dockerfile
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json
```

## Runtime Architecture

### Server
- `apps/server` runs NestJS on Fastify.
- The server boots from `apps/server/src/main.ts` in development.
- The built production path starts from `apps/server/dist/server/src/main.js` via `pnpm start`.
- In development it listens on `http://localhost:3000` by default.
- In production it defaults to port `8080` unless `PORT` is set.

### Web app
- `apps/web` builds a Vite client bundle into `apps/web/dist/client`.
- The React Router app is rendered on the NestJS side through `apps/web/src/entry-server.tsx`.
- The server serves the built client entry and CSS from `/static/...`.
- Runtime shape is one Nest-hosted full-stack app, not two separate deployed apps inside one container.

### State and infrastructure
- Session state is stored in Redis.
- BullMQ is configured against Redis and includes a demo queue/processor.
- PostgreSQL is used by the Drizzle package and stores contact submissions.

## Requirements

- Node.js 18+
- pnpm 9+
- Docker Desktop or local PostgreSQL + Redis

## Environment

Copy the example file:

```bash
cp .env.example .env
```

Current example values:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/appdb
REDIS_URL=redis://localhost:6379
SESSION_SECRET=dev-secret-change-me
NRR_APP_PORT=3000
NRR_POSTGRES_PORT=5432
NRR_REDIS_PORT=6379
APP_INTERNAL_ORIGIN=http://127.0.0.1:3000
```

## Local Development

### Local services already available

```bash
cp .env.example .env
pnpm install
pnpm db:push
pnpm dev
```

Then open `http://localhost:3000`.

### Compose-backed services

If ports `3000`, `5432`, or `6379` are already occupied on your machine, override the host ports first.

```bash
cp .env.example .env
export NRR_APP_PORT=3300
export NRR_POSTGRES_PORT=55432
export NRR_REDIS_PORT=56379
pnpm docker:up
DATABASE_URL=postgres://postgres:postgres@localhost:${NRR_POSTGRES_PORT}/appdb pnpm db:push
pnpm start
```

Then open `http://localhost:${NRR_APP_PORT}`.

### Full compose app path

To bring up the compose-defined app container as well:

```bash
export NRR_APP_PORT=3300
export NRR_POSTGRES_PORT=55432
export NRR_REDIS_PORT=56379
pnpm docker:up:build
```

## Available Commands

### Workspace

```bash
pnpm dev
pnpm start
pnpm build
pnpm lint
pnpm lint:fix
pnpm format
pnpm check
pnpm check:fix
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm verify
pnpm clean
pnpm kill
```

### Database

```bash
pnpm db:push
pnpm db:generate
pnpm db:studio
```

### Docker helpers

```bash
pnpm docker:up
pnpm docker:up:build
pnpm docker:down
pnpm docker:build
pnpm docker:logs
```

## Current App Surface

### Browser routes
- `/`
- `/stream`
- `/contact`
- `/dashboard`
- `/test`

### HTTP endpoints
- `GET /api/health` - Redis + PostgreSQL health check
- `POST /api/contact` - validate and persist contact submissions
- `GET /api/session-debug` - inspect current session data
- `GET /api/queue/add` - enqueue a demo BullMQ job
- `POST /auth/login` - store `{ email }` in session
- `POST /auth/logout` - clear session
- `GET /auth/me` - return current session user

## Auth model

Auth is intentionally minimal right now:
- no real user database lookup
- login stores the submitted email in session
- dashboard access is gated by session presence

## Database Notes

The `packages/db` package contains:
- Drizzle config
- a PostgreSQL client with lazy connection helpers
- sample `users` and `posts` schema definitions
- a `contact_submissions` table used by the starter contact flow

Use these commands from the repo root:

```bash
pnpm db:generate
pnpm db:push
pnpm db:studio
```

## Docker and Devcontainer

The Docker path is wired for local bring-up:
- `docker-compose.yml` starts PostgreSQL, Redis, and the app
- Docker host ports can be overridden with `NRR_APP_PORT`, `NRR_POSTGRES_PORT`, and `NRR_REDIS_PORT`
- `APP_INTERNAL_ORIGIN` can be used when SSR should call the app through an internal container-local address
- `Dockerfile` builds the monorepo and starts the built server path
- `.devcontainer/devcontainer.json` is included for containerized editor workflows

## Agent legibility

See `docs/agent-legibility.md`.

This starter tries to keep the following obvious to both humans and AI agents:
- where the app starts
- where routes and boundaries live
- where shared schemas live
- how to run, verify, and extend the app
- what is demo-only versus intended as a production seam

## Related Docs

- Architecture: `docs/architecture.md`
- Agent legibility: `docs/agent-legibility.md`
- Local setup: `docs/local-development.md`
- Release checklist: `docs/release-checklist.md`
- Route-organization notes: `apps/web/src/routes/README.md`
- Secrets guidance: `SECRETS_POLICY.md`

## Contributing

If you extend the starter:
- keep docs aligned with actual runnable behavior
- prefer deterministic verification over hidden build magic
- document whether a feature is demo-only or production-ready
- preserve agent-legible naming and boundaries when adding new surfaces

## License

MIT. See `LICENSE`.
