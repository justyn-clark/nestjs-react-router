
# syntax=docker/dockerfile:1

FROM node:20-slim AS base
WORKDIR /app

FROM base AS deps
RUN corepack enable
COPY package.json pnpm-lock.yaml* turbo.json ./
COPY apps/server/package.json apps/server/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/redis/package.json packages/redis/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm i --frozen-lockfile

FROM deps AS build
COPY . .
# Build web client
RUN pnpm -C apps/web build
# Build server
RUN pnpm -C apps/server build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/server/dist ./apps/server/dist
COPY --from=build /app/apps/web/dist/client ./apps/web/dist/client
COPY .env ./.env
EXPOSE 3000
CMD ["node", "apps/server/dist/src/main.js"]
