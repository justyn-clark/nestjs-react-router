# Tech stack map

This starter is not just a list of packages. It is a mapped set of roles.

## Included technologies and why they are here

### NestJS

Role:
- application host
- HTTP entrypoint
- SSR orchestration boundary
- backend module structure

Why it matters:
- gives a clear service boundary for API work, auth, jobs, and application wiring
- keeps server ownership explicit instead of scattering server logic through the frontend

### React 19

Role:
- UI runtime
- client interaction layer
- SSR-compatible component system

Why it matters:
- modern React baseline for new application work
- strong ecosystem support and compatibility with current React Router patterns

### React Router 7

Role:
- route model
- loader/action model
- SSR route execution model

Why it matters:
- route modules make application behavior easier to understand and evolve
- loaders and actions provide explicit seams for data and mutations

### PostgreSQL + Drizzle

Role:
- durable data storage
- schema ownership
- type-safe persistence boundary

Why it matters:
- persistent state belongs in a durable database with explicit schema control
- Drizzle keeps data contracts close to the application instead of hiding them behind magic

### Redis + BullMQ

Role:
- session state
- queue state
- async job execution seam

Why it matters:
- modern applications often need ephemeral state and background work
- exposing that seam early makes the starter easier to grow into real production workflows

### pnpm workspace + Turbo

Role:
- package structure
- build/test coordination
- shared package ownership

Why it matters:
- the starter is designed as a system, not a single folder of accidental files
- workspace boundaries make the architecture more legible to both humans and agents

## Agent-native application building

In an agentic-native world, good application structure should help agents answer these questions quickly:

- where does the app start?
- where does the route live?
- what owns this data?
- what is safe to change?
- how do I verify the change?
- what is demo-only and what is production-intended?

This starter tries to answer those questions by structure, not by explanation alone.

## Evolution path

Typical growth path from this starter:

1. replace demo auth with a real identity system
2. introduce domain entities in PostgreSQL
3. add feature route modules by business area
4. use queue seams for real async jobs
5. evolve the shell into product-specific UI without fighting a baked-in visual brand

## Design rule

The stack is here to support clear application building, not to impress people with a trendy dependency list.
