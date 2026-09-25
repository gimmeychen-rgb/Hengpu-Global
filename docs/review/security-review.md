# Security Review

## Executive Summary

The MVP uses bcrypt and JWT, which are appropriate starting choices. However, the current system is not production-secure. The highest-risk areas are hard-coded/default secrets, incomplete authorization, permissive CORS, browser localStorage token storage, seeded non-bcrypt passwords, and lack of audit logging.

## JWT

Current state:

- JWTs are issued on register and login.
- Tokens include `sub`, `email`, and `role`.
- Expiration is set to one day.
- Guards verify token with `JWT_SECRET` or a local default.

Risks:

- Default secret `hengpu-local-secret` is unsafe outside local development.
- No issuer or audience validation.
- No refresh or revocation mechanism.
- No key rotation plan.
- Tokens are stored in `localStorage`, increasing exposure if XSS occurs.

Recommendations:

- Require `JWT_SECRET` in non-local environments.
- Add issuer and audience validation.
- Use short-lived access tokens and refresh tokens stored in secure HTTP-only cookies if browser security requirements increase.
- Add logout/session revocation strategy.
- Centralize JWT guard logic.

## Password Storage

Current state:

- Registered users use bcrypt with cost 10.
- Seed users have `password_hash = 'seeded'`.

Risks:

- Seed users cannot safely authenticate and violate hash invariants.
- Password minimum length is 6, which is low.
- No rate limiting on login.
- No account lockout or suspicious login detection.

Recommendations:

- Store only valid bcrypt hashes in `password_hash`.
- Raise password length requirements for production.
- Add rate limiting to auth endpoints.
- Add login attempt audit logs.
- Add password reset flow only after email verification infrastructure exists.

## Input Validation

Strengths:

- `class-validator` DTOs are used.
- Validation pipes are enabled.
- Parameterized SQL is used.

Gaps:

- String lengths are unconstrained.
- No sanitization strategy for text displayed in admin/web.
- UUID route params are not validated.
- Supplier categories are not constrained.
- Project create accepts arbitrary existing IDs from callers.

Recommendations:

- Add length and format limits.
- Validate UUID params.
- Restrict category inputs.
- Add ownership/relationship validation before creating projects.
- Add output encoding discipline on frontend.

## SQL Injection Risks

Good:

- Most SQL queries use parameter placeholders.

Concern:

- `user-service` dynamically builds the update column list from DTO object keys. Current validation makes this low risk, but dynamic SQL should be constrained with a fixed column whitelist.

Recommendations:

- Use a whitelist map for dynamic updates.
- Consider a query builder or ORM for safer typed updates.
- Add tests for injection attempts and invalid fields.

## CORS

Current state:

- Every Nest service calls `app.enableCors()` without restrictions.

Risk:

- All origins may call APIs during browser sessions.

Recommendations:

- Restrict CORS by environment.
- Allow only web/admin origins in production.
- Define allowed methods and headers explicitly.
- Avoid exposing internal services publicly where possible.

## Secrets Management

Current state:

- Docker Compose includes database password and JWT secret inline.
- Services fall back to local defaults.
- No `.env.example` or secret loading policy exists.

Recommendations:

- Move secrets to environment variables or Docker secrets.
- Add `.env.example` with non-secret placeholders.
- Fail fast if required production secrets are missing.
- Rotate secrets before any external deployment.

## Authorization Risks

High-risk authorization gaps:

- Admin views call APIs that are not admin-only.
- Any authenticated user can list all users.
- Supplier verification can be caller-controlled.
- Project creation does not verify actor role or ownership.
- Matching endpoint is public.

Recommendations:

- Define role-based access matrix.
- Implement `RolesGuard` across all services.
- Add ownership checks.
- Separate admin APIs from public application APIs.
- Audit all privileged operations.

## Deployment Security

Current Docker concerns:

- Containers expose all service ports to host.
- No health checks.
- No non-root runtime user.
- `npm install` is used instead of deterministic `npm ci`.
- No image vulnerability scanning.

Recommendations:

- Expose only gateway/frontend publicly.
- Run containers as non-root where possible.
- Add health checks.
- Use lockfiles and deterministic installs.
- Add image scanning in CI.

## Security Priority List

High:

- Remove default production secrets.
- Enforce authorization on admin and write endpoints.
- Restrict CORS.
- Add rate limiting for auth.
- Replace seeded password placeholders.

Medium:

- Add token revocation/refresh strategy.
- Add audit logging.
- Add input length limits and UUID validation.
- Add service-to-service authentication.

Low:

- Add Content Security Policy.
- Add dependency scanning.
- Add threat model documentation.
