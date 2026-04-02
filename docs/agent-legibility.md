# Agent legibility

This starter treats agent legibility as a first-class quality, not an accidental side effect.

## Goal

An AI agent should be able to quickly infer:

- where the app starts
- where routes live
- where server boundaries are
- where schemas and contracts live
- how to run the app
- how to verify the app
- what is demo-only versus production-intended
- where to extend behavior safely

## Current conventions

### 1. Explicit entrypoints

- Development server entry: `apps/server/src/main.ts`
- Built production entry: `apps/server/dist/apps/server/src/main.js` via `pnpm start`
- Web SSR entry: `apps/web/src/entry-server.tsx`
- Web client entry: `apps/web/src/entry-client.tsx`

### 2. Clear package boundaries

- `apps/server` owns HTTP, SSR orchestration, session handling, and queue hooks
- `apps/web` owns route tree, UI, loaders, and actions
- `packages/db` owns PostgreSQL schema and connection helpers
- `packages/redis` owns Redis wiring
- `packages/shared` owns shared schemas and helpers

### 3. Shared contracts over hidden assumptions

- validation schemas live in shared packages when both server and web use them
- health checks expose dependency status explicitly
- smoke scripts check visible behavior, not only internal implementation

### 4. Deterministic verification

Preferred verification flow:

```bash
pnpm verify
pnpm start
pnpm test:e2e
```

For compose-backed services:

```bash
export NRR_APP_PORT=3300
export NRR_POSTGRES_PORT=55432
export NRR_REDIS_PORT=56379
pnpm docker:up
DATABASE_URL=postgres://postgres:postgres@localhost:${NRR_POSTGRES_PORT}/appdb pnpm db:push
PORT=${NRR_APP_PORT} NODE_ENV=production DATABASE_URL=postgres://postgres:postgres@localhost:${NRR_POSTGRES_PORT}/appdb REDIS_URL=redis://localhost:${NRR_REDIS_PORT} pnpm start
SMOKE_BASE_URL=http://127.0.0.1:${NRR_APP_PORT} pnpm test:e2e
```

### 5. Demo surfaces are labeled

Current demo-only areas:
- auth
- queue processing

Agents should treat these as starter seams, not as complete product implementations.

## Design rule

Prefer:
- obvious names
- explicit boundaries
- small shared contracts
- truthful docs
- deterministic checks

Avoid:
- hidden runtime magic
- ambiguous ownership
- stale-cache-sensitive workflows presented as canonical
- docs that claim more than the code really does
