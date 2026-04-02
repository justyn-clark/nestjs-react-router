# Route organization

This starter uses a route-module pattern instead of a single inline route-object file.

## Current structure

```text
src/
├── modules/
│   ├── root/routes/
│   │   ├── root.route.tsx
│   │   └── home.route.tsx
│   ├── stream/routes/stream.route.tsx
│   ├── dashboard/routes/dashboard.route.tsx
│   ├── contact/routes/contact.route.tsx
│   └── test/routes/test.route.tsx
├── routes/
│   ├── actions.ts
│   ├── loaders.ts
│   ├── config.ts
│   └── README.md
└── routes.tsx
```

## Why this pattern

- route manifest stays small and readable
- route modules are grouped by feature/domain
- loaders and actions remain easy to find
- the structure is easier for humans and agents to extend without guessing

## Current route manifest

`src/routes.tsx` is now only a small manifest that composes route modules using helper functions:
- `layout(...)`
- `index(...)`
- `route(...)`

This mirrors the direction used in JustBeatz-style route organization even though this starter is still using runtime `RouteObject` composition rather than the full `@react-router/dev/routes` toolchain.

## Next extension rule

When adding new surfaces:
- create a feature/module directory first
- place route modules under that feature's `routes/` folder
- keep the top-level manifest declarative and short
- avoid growing `routes.tsx` back into route soup
