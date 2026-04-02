# Local development

## Prerequisites

- Node.js 22 recommended
- pnpm 9+
- Docker Desktop or local PostgreSQL + Redis

## Quick start with local services

```bash
cp .env.example .env
pnpm install
pnpm db:push
pnpm dev
```

Open `http://localhost:3000`.

## Quick start with Docker

If ports `3000`, `5432`, or `6379` are already occupied on your machine, override the host ports first.

```bash
cp .env.example .env
export NRR_APP_PORT=3300
export NRR_POSTGRES_PORT=55432
export NRR_REDIS_PORT=56379
pnpm docker:up
```

Then use the containerized service values:

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:${NRR_POSTGRES_PORT}/appdb pnpm db:push
open http://localhost:${NRR_APP_PORT}
```

## Useful commands

```bash
pnpm check
pnpm test
pnpm test:e2e
pnpm typecheck
pnpm build
pnpm db:push
pnpm docker:logs
pnpm docker:down
```

## Notes

- `pnpm start` runs the built production app path from `apps/server/dist/apps/server/src/main.js`.
- `pnpm dev` runs the development path.
- `pnpm test:e2e` is an end-to-end smoke script against a running app instance.
