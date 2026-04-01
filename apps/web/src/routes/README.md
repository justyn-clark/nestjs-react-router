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
  - `contactAction` validates basic form input and posts to `POST /api/contact`
  - `dashboardAction` exists but is not currently wired into `routes.tsx`

## Notes about current implementation

- Logic is split out of `routes.tsx` into loader/action modules.
- The route tree includes IDs for some routes (`root`, `stream`, `dashboard`, `contact`, `test`), but not every route uses one.
- Auth is session-based and demo-oriented: login stores an email in session and dashboard access checks for session presence.
- Error handling is provided by `components/ErrorBoundary.tsx`.
- Contact submission validation is shared with the backend through the workspace schema package.

## Caveats

A few earlier documentation claims were broader than the code:
- not every route has an ID
- auth is still demo auth, not a full identity system
- the contact flow now persists submissions, but it is still intentionally simple and not a CRM integration

If you expand this area, keep this file aligned with the real route behavior rather than idealized patterns.
