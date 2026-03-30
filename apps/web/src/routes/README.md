# React Router Route Notes

This directory holds the route helper modules used by the React Router 7 app.

## Current Structure

```text
routes/
├── index.ts      # Re-exports route helpers
├── loaders.ts    # Loader functions
├── actions.ts    # Action functions
└── README.md     # This file
```

The main route tree itself lives in `../routes.tsx`.

## What the current code does

- `loaders.ts`
  - `rootLoader` fetches `/auth/me` and exposes the current session user plus an optional `message` query param
  - `streamLoader` returns a small demo payload after a short delay
  - `dashboardLoader` redirects to `/` with a message when no session user is present

- `actions.ts`
  - `rootAction` handles login and logout flows by calling Nest auth endpoints
  - `contactAction` validates that an email exists, then returns a stub `{ ok: true }` response
  - `dashboardAction` exists but is not currently wired into `routes.tsx`

## Notes about current implementation

- Logic is split out of `routes.tsx` into loader/action modules.
- The route tree includes IDs for some routes (`root`, `stream`, `dashboard`, `contact`, `test`), but not every route uses one.
- Auth is session-based and demo-oriented: login stores an email in session and dashboard access checks for session presence.
- Error handling is provided by `components/ErrorBoundary.tsx`.
- There is no schema-backed validation layer in these route helpers yet.

## Caveats

A few earlier documentation claims were broader than the code:
- not every route has an ID
- validation is mostly simple manual checks today
- the contact flow is not connected to a real submission backend yet

If you expand this area, keep this file aligned with the real route behavior rather than idealized patterns.
