# Technical Debt

## Executive Summary

The MVP intentionally prioritizes working flow over production architecture. The debt is manageable if addressed before adding new business domains. The most important rule is to stabilize platform foundations before building CRM, ERP, government cooperation, or AI modules.

## High Priority Debt

### Authorization is incomplete

Impact:

- Admin and sensitive data endpoints are accessible to any authenticated user in several cases.
- Supplier verification can be caller-controlled.
- Project creation lacks ownership checks.

Suggested refactoring:

- Define a role/access matrix.
- Apply shared `RolesGuard` and ownership checks.
- Separate admin APIs from public APIs.

### Shared database access across all services

Impact:

- Services are tightly coupled through tables.
- Schema changes can break many services.
- Cross-domain writes are uncontrolled.

Suggested refactoring:

- Move toward schema ownership.
- Introduce service APIs or events for cross-domain updates.
- Add repositories per service.

### Duplicated auth and database code

Impact:

- Security fixes must be copied manually.
- Guard behavior can drift across services.

Suggested refactoring:

- Create a shared backend platform package.
- Centralize JWT verification, typed user context, database config, error filters, and logging.

### No migration framework

Impact:

- Production schema evolution is unsafe.
- Docker init SQL cannot manage incremental changes.

Suggested refactoring:

- Adopt a migration tool.
- Separate schema and seed data.
- Add migration checks to CI.

### No tests

Impact:

- Critical MVP flows can regress silently.

Suggested refactoring:

- Add unit tests for auth, validation, matching, and trust score rules.
- Add API integration tests against test PostgreSQL.
- Add basic Playwright smoke tests for web and admin flows.

## Medium Priority Debt

### Controllers contain SQL and business logic

Impact:

- Controllers become hard to test and maintain.
- Business rules are spread across files.

Suggested refactoring:

- Introduce service/use-case classes.
- Add repository classes for SQL.
- Move trust and matching rules into domain services.

### API consistency needs cleanup

Impact:

- Mixed RPC and REST route names make the API harder to evolve.

Suggested refactoring:

- Normalize create routes to resource routes.
- Add `/v1`.
- Add OpenAPI documentation.

### Error responses are inconsistent

Impact:

- Frontend and admin cannot reliably handle failures.

Suggested refactoring:

- Add global exception filters.
- Use proper Nest exceptions instead of ad hoc error objects.
- Standardize error envelope.

### Missing pagination

Impact:

- List endpoints will degrade with data growth.

Suggested refactoring:

- Add `limit`, `cursor`, and stable sort support.
- Set maximum page sizes.

### Docker setup is development-oriented

Impact:

- Not hardened for production deployment.

Suggested refactoring:

- Add health checks.
- Use deterministic installs.
- Run as non-root.
- Stop exposing internal service ports publicly.

## Low Priority Debt

### Placeholder portal apps

Impact:

- May confuse contributors.

Suggested refactoring:

- Keep documented placeholders or remove until active development begins.

### Shared UI package is underused

Impact:

- Some UI duplication will grow over time.

Suggested refactoring:

- Add reusable tables, forms, buttons, fields, and layout primitives after UX patterns stabilize.

### Trust score is not auditable

Impact:

- Future compliance and dispute workflows will need evidence.

Suggested refactoring:

- Add `trust_score_events`.
- Make trust score updates append-only plus projected current score.

## Recommended Debt Burn-Down Order

1. Authorization and role matrix.
2. Migration framework.
3. Shared backend platform package.
4. Tests for MVP flows.
5. Controller/service/repository separation.
6. API route consistency and OpenAPI.
7. Pagination and database indexes.
8. Observability and Docker hardening.
9. Event-driven trust and matching.
10. UI/shared frontend consolidation.
