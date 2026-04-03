# Release checklist

Use this checklist before publishing the starter.

## Code quality

- [ ] `pnpm install --frozen-lockfile`
- [ ] `pnpm verify`
- [ ] clean rebuild of `apps/server/dist` if server-side web output changed

## Runtime verification

- [ ] `pnpm start`
- [ ] visit `/`
- [ ] visit `/dashboard` and verify session gating
- [ ] submit the contact form and confirm a row lands in `contact_submissions`
- [ ] hit `/api/health` and confirm Redis + PostgreSQL report healthy
- [ ] hit `/api/queue/add` and confirm a demo job enqueues cleanly
- [ ] restart the app and confirm recent task/activity control-plane data hydrates from PostgreSQL
- [ ] run `pnpm test:e2e` against the built app

## Docker verification

- [ ] validate compose-backed Postgres + Redis path
- [ ] validate `pnpm start` against those compose-backed services
- [ ] validate `pnpm docker:up:build` app-container path with alternate host ports when defaults are occupied

## Documentation hygiene

- [ ] README matches actual repo behavior
- [ ] docs/ files reflect current startup flow
- [ ] agent-legibility notes still match the codebase
- [ ] `.env.example` is still accurate
- [ ] badges are present but restrained

## Release confidence

- [ ] CI is green
- [ ] LICENSE is present
- [ ] demo-only surfaces are clearly labeled as demo-only
