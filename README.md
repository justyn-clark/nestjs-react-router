<div align="center">

# NestJS React Router

<p align="center">
  <a href="https://github.com/justyn-clark/nestjs-react-router/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/justyn-clark/nestjs-react-router/ci.yml?branch=main&label=ci"></a>
  <a href="https://github.com/justyn-clark/nestjs-react-router/releases"><img alt="Release" src="https://img.shields.io/github/v/release/justyn-clark/nestjs-react-router?display_name=tag"></a>
  <a href="https://github.com/justyn-clark/nestjs-react-router/tags"><img alt="Tag" src="https://img.shields.io/github/v/tag/justyn-clark/nestjs-react-router"></a>
  <a href="./LICENSE"><img alt="License" src="https://img.shields.io/github/license/justyn-clark/nestjs-react-router"></a>
  <a href="#quick-start"><img alt="Stack" src="https://img.shields.io/badge/stack-NestJS%20%7C%20React%20Router%207%20%7C%20PostgreSQL%20%7C%20Redis-0f172a"></a>
</p>

<p align="center">
  <img src="assets/logos/nestjs-logo.svg" alt="NestJS Logo" width="120" height="120"/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="assets/logos/rr_logo_light.svg" alt="React Router Logo" width="120" height="120"/>
</p>

A truthful, opinionated starter where NestJS 11 hosts and renders a React Router 7 app with SSR, React 19, PostgreSQL persistence, Redis-backed state, and shared workspace packages.

</div>

## Why this starter

Use this if you want:
- one Nest-hosted full-stack app instead of a fake split frontend/backend setup
- SSR with React Router 7
- PostgreSQL via Drizzle
- Redis-backed sessions and queue wiring
- deterministic verification that is friendly to both humans and agents

## What it includes

- NestJS 11 on Fastify 5
- React 19 + React Router 7 SSR bridge
- pnpm workspace + Turborepo layout
- route-module manifest pattern for feature-oriented routing
- PostgreSQL package with Drizzle schema and helpers
- Redis-backed sessions
- BullMQ demo queue wiring
- contact submission flow persisted to PostgreSQL
- health endpoint covering Redis and PostgreSQL
- CI, devcontainer config, and release docs
- end-to-end smoke coverage against a running built app
- a tech stack map for modern and agent-legible application building
- a starter control plane with slash-command palette, activity feed, task runs, and realtime events

## Intentional seams

This starter is publishable and usable, but it stays honest about what is still demo-level:
- auth is demo auth, not a production identity system
- queue processing is demo scaffolding

## Quick start

### Local services already available

```bash
cp .env.example .env
pnpm install
pnpm db:push
pnpm dev
```

Open `http://localhost:3000`.

### Compose-backed path

If ports `3000`, `5432`, or `6379` are already occupied:

```bash
cp .env.example .env
export NRR_APP_PORT=3300
export NRR_POSTGRES_PORT=55432
export NRR_REDIS_PORT=56379
pnpm docker:up
DATABASE_URL=postgres://postgres:postgres@localhost:${NRR_POSTGRES_PORT}/appdb pnpm db:push
pnpm start
```

Open `http://localhost:${NRR_APP_PORT}``.

### Full compose app container

```bash
export NRR_APP_PORT=3300
export NRR_POSTGRES_PORT=55432
export NRR_REDIS_PORT=56379
pnpm docker:up:build
```

## Verify it

```bash
pnpm verify
pnpm start
pnpm test:e2e
```

## Runtime shape

This is one Nest-hosted full-stack application.

- Nest handles API routes, auth/session endpoints, and SSR orchestration
- React Router is rendered and served through Nest
- client assets are served from the built web output

It is not two independently deployed apps pretending to be one product.

## Main routes and endpoints

The web shell now includes a small control-plane layer:
- slash-command palette
- realtime activity feed
- task/run surface
- app-native control actions such as enqueueing the demo job
- PostgreSQL-backed persistence for recent task runs and activity events


Browser routes:
- `/`
- `/stream`
- `/contact`
- `/dashboard`
- `/test`

HTTP endpoints:
- `GET /api/health`
- `GET /api/control-plane/summary`
- `GET /api/control-plane/events`
- `POST /api/contact`
- `GET /api/session-debug`
- `GET /api/queue/add`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

## Commands

```bash
pnpm dev
pnpm start
pnpm verify
pnpm start
pnpm test:e2e
pnpm db:push
pnpm docker:up
pnpm docker:up:build
pnpm docker:down
```

## Read next

- Architecture: `docs/architecture.md`
- Local development: `docs/local-development.md`
- Agent legibility: `docs/agent-legibility.md`
- Tech stack map: `docs/tech-stack-map.md`
- Release checklist: `docs/release-checklist.md`
- Route notes: `apps/web/src/routes/README.md`
- Secrets guidance: `SECRETS_POLICY.md`

## License

MIT. See `LICENSE`.
