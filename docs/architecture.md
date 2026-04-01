# Architecture

This starter combines a NestJS Fastify server with a React Router 7 app that is rendered and served through the server.

## Runtime shape

This is one Nest-hosted full-stack application.

It is not:
- a separate API app and separate frontend app deployed independently
- a split frontend/backend system that only happens to share a repo

The server is the runtime entrypoint. React Router is rendered through that server.

## Packages

- `apps/server`: NestJS entrypoint, SSR bridge, auth/session endpoints, health endpoint, and BullMQ demo queue.
- `apps/web`: React Router 7 application built with Vite.
- `packages/db`: Drizzle ORM package for PostgreSQL schema and health checks.
- `packages/redis`: shared Redis client for sessions and queue infrastructure.
- `packages/shared`: shared schemas and helpers used across the monorepo.

## Request flow

1. Browser requests hit `apps/server`.
2. NestJS handles API and auth routes directly.
3. Non-API routes are passed into the React Router static handler.
4. The server renders the React app and serves the built client bundle from `/static/...`.

## Stateful pieces

- Sessions are stored in Redis.
- BullMQ uses Redis.
- Contact submissions are stored in PostgreSQL via Drizzle.
- `/api/health` checks both Redis and PostgreSQL.

## Build notes

- `apps/web` builds browser assets into `apps/web/dist/client`.
- `apps/server` also compiles the SSR entry and route tree into its own `dist` tree so the built server can render pages.
- The starter currently favors deterministic verification over aggressive Turbo caching. This is intentional until the build flow is further simplified.

## Starter intent

This repo is meant to be a strong starting point for full-stack applications that want:

- NestJS for backend structure
- React Router 7 for the frontend app shell
- SSR without a separate Next.js-style framework
- Redis-backed sessions and queue support
- a shared package workspace for schemas and infra code
- boundaries that are legible to both humans and agents
