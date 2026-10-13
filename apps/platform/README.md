# Hengpu business platform

This application preserves the business pages previously located in `apps/web`.
It is not approved for public deployment.

Run commands from the monorepo root:

- `npm run dev:platform`: development server on port 3020.
- `npm run build:platform`: production build with TypeScript checking.
- `npm --workspace apps/platform run start`: serve the production build on port 3020.

The root URL redirects to `/dashboard`. Existing routes remain `/login`,
`/register`, `/dashboard`, `/requests`, `/requests/create`,
`/requests/[id]/matches`, and `/suppliers`.

The existing API helper uses `NEXT_PUBLIC_AUTH_API`, `NEXT_PUBLIC_USER_API`,
`NEXT_PUBLIC_REQUEST_API`, `NEXT_PUBLIC_SUPPLIER_API`,
`NEXT_PUBLIC_MATCHING_API`, and `NEXT_PUBLIC_PROJECT_API`, with the existing
localhost service defaults. Browser-facing variables must be set when building.
No backend services, PostgreSQL, or Redis are required to compile the app;
real business operations still require the existing backend stack.

The corporate website remains in `apps/web` on port 3000. Admin and backend
applications are unchanged. Deployment configuration has not been migrated in
this phase; do not use the full development Compose stack for corporate publication.
