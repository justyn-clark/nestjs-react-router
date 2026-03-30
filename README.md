<div align="center">

# NestJS React Router

<p align="center">
  <img src="assets/logos/nestjs-logo.svg" alt="NestJS Logo" width="120" height="120"/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="assets/logos/rr_logo_light.svg" alt="React Router Logo" width="120" height="120"/>
</p>

A starter monorepo that wires a NestJS server to a React Router 7 app with server-side rendering, Redis-backed session state, and shared workspace packages.

</div>

## Status

This repo is a **starter / playground**, not a polished production template yet.

What is present today:
- NestJS 10 on Fastify
- React 18 + React Router 7 SSR bridge
- Turborepo + pnpm workspace layout
- Tailwind CSS 4 in the web app
- Drizzle ORM package for PostgreSQL access
- Redis integration for sessions and BullMQ demo jobs
- A small demo app with login/logout, dashboard gating, contact form stub, stream demo, and queue demo endpoint

What is **not** fully baked yet:
- No checked-in CI workflow
- No top-level `docs/` directory
- Docker/devcontainer flow is incomplete in the current repo state
- The contact form is a stub
- The current health endpoint checks Redis only, not PostgreSQL

## Repository Layout

```text
nestjs-react-router/
├── apps/
│   ├── server/                 # NestJS + Fastify server and SSR bridge
│   └── web/                    # React Router 7 app built with Vite
├── packages/
│   ├── db/                     # Drizzle/PostgreSQL package
│   ├── redis/                  # Shared Redis client
│   └── shared/                 # Shared helpers and schemas
├── assets/                     # README assets/logos
├── scripts/                    # Local setup helper script
├── docker-compose.yml
├── Dockerfile
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Runtime Architecture

### Server
- `apps/server` runs NestJS on Fastify.
- The server boots from `apps/server/src/main.ts`.
- In development it listens on `http://localhost:3000` by default.
- In production it defaults to port `8080` unless `PORT` is set.

### Web app
- `apps/web` builds a Vite client bundle into `apps/web/dist/client`.
- The React Router app is rendered on the NestJS side through `apps/web/src/entry-server.tsx`.
- The server serves the built client entry and CSS from `/static/...`.

### State and infrastructure
- Session state is stored in Redis.
- BullMQ is configured against Redis and includes a demo queue/processor.
- PostgreSQL is expected for the Drizzle package, but the sample app currently leans more heavily on Redis/session flows than DB-backed features.

## Requirements

- Node.js 18+
- pnpm 9+
- Redis running locally on `localhost:6379` unless you change env values
- PostgreSQL running locally on `localhost:5432` if you want to use Drizzle commands such as `db:push`

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
```

Notes:
- `REDIS_URL` is used by the shared Redis client.
- BullMQ currently reads `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` / `REDIS_DB` in the Nest app module rather than parsing `REDIS_URL`.
- `DATABASE_URL` is required for Drizzle commands and the shared DB package.

## Local Development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start Redis and PostgreSQL yourself.

   The committed `docker-compose.yml` currently starts **Redis only** by default. The PostgreSQL service block is commented out, so you must either:
   - run PostgreSQL locally, or
   - uncomment/adapt the PostgreSQL service in `docker-compose.yml`.

3. Create `.env` if you have not already:

   ```bash
   cp .env.example .env
   ```

4. If you want the DB package ready, push the schema:

   ```bash
   pnpm db:push
   ```

5. Start the dev stack:

   ```bash
   pnpm dev
   ```

6. Open:

   ```text
   http://localhost:3000
   ```

### What `pnpm dev` does

The root dev script:
- kills prior processes on ports `3000` and `5174`
- stops prior Turbo / `tsx watch` processes when possible
- runs Turbo dev for the server and web packages

The current package-level behavior is:
- `apps/server`: `tsx watch src/main.ts`
- `apps/web`: `vite build --watch`

That means the web app is built in watch mode while NestJS handles SSR and serves the built assets.

## Available Commands

### Workspace

```bash
pnpm dev
pnpm build
pnpm lint
pnpm lint:fix
pnpm format
pnpm check
pnpm check:fix
pnpm typecheck
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
- `GET /api/health` — Redis health check
- `GET /api/session-debug` — inspect current session data
- `GET /api/queue/add` — enqueue a demo BullMQ job
- `POST /auth/login` — store `{ email }` in session
- `POST /auth/logout` — clear session
- `GET /auth/me` — return current session user

### Auth model

Auth is intentionally minimal right now:
- no real user database lookup
- login stores the submitted email in session
- dashboard access is gated by session presence

## Database Notes

The `packages/db` package contains:
- Drizzle config
- a PostgreSQL client using `postgres`
- sample `users` and `posts` schema definitions

Use these commands from the repo root:

```bash
pnpm db:generate
pnpm db:push
pnpm db:studio
```

## Redis and Queue Notes

Redis is used for:
- session storage
- BullMQ queue infrastructure

A demo queue processor lives under `apps/server/src/modules/queue`.

## Setup Script Caveat

The repository includes `scripts/test-setup.sh` and the root command:

```bash
pnpm test:setup
```

Treat this as a convenience script, not a guaranteed green end-to-end verifier. In the current repo state it assumes a PostgreSQL service is available on localhost and also attempts `docker compose up -d postgres redis`, while the committed Compose file only exposes Redis by default.

## Docker Status

Docker-related files exist, but the Docker path should be treated as **work in progress**:
- `Dockerfile` expects `pnpm-lock.yaml`, which is not currently checked into the repo
- `docker-compose.yml` only has Redis enabled by default
- the README previously overstated Docker readiness

If you want a dependable local start today, use direct local services or update the Docker files before relying on them.

## Related Docs

- Route-organization notes: `apps/web/src/routes/README.md`
- Secrets guidance: `SECRETS_POLICY.md`

## Contributing

If you extend the starter:
- keep docs aligned with actual runnable behavior
- prefer updating scripts and infra examples alongside README changes
- document whether a feature is demo-only or production-ready

## License

The repository README historically referenced MIT, but there is currently no checked-in `LICENSE` file in this repo. Add one if you want the licensing status to be explicit.
