# Code Quality Review

## Executive Summary

The codebase is intentionally small and readable, which is appropriate for an MVP. The main quality concern is duplication across services, especially JWT guards, database configuration, package metadata, and controller-level SQL. As the system grows, this duplication will slow delivery and increase security drift.

## Code Duplication

High duplication exists in:

- `database.ts` across every service.
- `jwt.guard.ts` across most services.
- NestJS package manifests and TypeScript/Nest config files.
- Frontend API helper patterns across `apps/web` and `apps/admin`.
- Table rendering patterns in admin pages.

Recommended refactoring:

- Create `packages/backend-common` or `packages/nest-common`.
- Move shared `JwtAuthGuard`, database pool configuration, typed request user, role decorators, error helpers, and logging there.
- Create shared frontend API client utilities for token handling and service URL resolution.
- Add reusable table and form components to `packages/ui`.

## Naming Consistency

Current naming is mostly consistent but mixes REST and RPC styles.

Examples:

- `POST /auth/register` and `POST /auth/login` are conventional.
- `POST /requests/create`, `POST /suppliers/create`, and `POST /projects/create` are RPC-like.
- Database uses snake_case.
- TypeScript uses camelCase in some places and database field names in others.

Recommendations:

- Prefer REST resource naming: `POST /requests`, `POST /suppliers`, `POST /projects`.
- Keep database snake_case, but map to camelCase DTOs or consistently expose snake_case in API contracts.
- Define API response types in `packages/types` and use them in both frontend and backend.

## Folder Organization

The top-level organization is clear:

- `apps`
- `services`
- `packages`
- `infra`
- `docs`

Within services, each service currently has flat files under `src`. This is fine for MVP, but each service should eventually move toward:

- `controllers`
- `dto`
- `services`
- `repositories`
- `guards`
- `domain`
- `tests`

The placeholder apps `buyer-portal` and `supplier-portal` are acceptable as reserved workspaces, but they should either be implemented or documented as intentionally empty to prevent confusion.

## Type Safety

Strengths:

- TypeScript strict mode is enabled in the base config.
- DTOs use `class-validator`.
- Shared domain type definitions exist in `packages/types`.

Weaknesses:

- SQL result rows are untyped.
- Request objects use inline structural types instead of typed request context.
- Shared types are not consistently imported into services or apps.
- `UpdateUserDto` dynamically builds SQL from object entries; the DTO currently limits fields, but the pattern should be constrained with a whitelist map.
- `UpdateProjectStatusDto.outcome` is optional in validation but marked as non-optional in TypeScript.

Recommendations:

- Add typed row interfaces or a query builder.
- Use shared API contract types for request and response payloads.
- Define a `RequestWithUser` type.
- Add compile-time tests or strict API contract tests.

## Error Handling

Strengths:

- Nest exceptions are used in core auth and request creation paths.
- Basic validation pipes are enabled globally.

Weaknesses:

- Some endpoints return `null` instead of `404`.
- `user-service` returns `{ error: 'Forbidden' }` instead of throwing `ForbiddenException`.
- Frontend error messages are generic and do not preserve structured API error details.
- No consistent error envelope exists across services.
- Database errors are not normalized.

Recommendations:

- Standardize errors with a shared exception filter.
- Return proper status codes for not found, forbidden, conflict, and validation failures.
- Avoid returning ad hoc error objects.
- Add request IDs to error responses.

## Logging

Current state:

- No application logging beyond Nest defaults.
- No structured logs.
- No audit logs for admin or security-sensitive operations.
- No correlation IDs.

Recommendations:

- Add structured JSON logging with request ID, user ID, route, status, latency, and service name.
- Add audit logging for registration, login failures, role changes, supplier verification, project closure, and trust score changes.
- Add log redaction for passwords, JWTs, and secrets.

## Maintainability Assessment

MVP maintainability: Medium.

Long-term maintainability: Low to Medium until shared platform code, tests, and layering are introduced.

Top quality priorities:

1. Extract shared backend auth/database/error/logging code.
2. Move SQL out of controllers.
3. Standardize route naming and response shapes.
4. Add tests for the critical user journeys.
5. Adopt migrations and typed database access.
