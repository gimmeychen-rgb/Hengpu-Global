# Architecture Review

## Executive Summary

The repository is a functional MVP skeleton for the Hengpu Platform. It uses a monorepo with separate Next.js apps, NestJS services, shared packages, PostgreSQL, Redis, and Docker. The structure is directionally aligned with a future multi-domain platform, but the current implementation is closer to a modular prototype than a production microservice architecture.

The most important architectural concern is that every backend service connects directly to the same database and repeats authentication/database code locally. This is acceptable for MVP validation, but it creates tight coupling, duplicated security logic, and unclear ownership boundaries as the platform grows.

## Current Architecture

- `apps/web`: buyer-facing MVP application with authentication, dashboard, requests, suppliers, and matches.
- `apps/admin`: minimal admin panel for users, requests, suppliers, and projects.
- `apps/supplier-portal`: reserved placeholder.
- `apps/buyer-portal`: reserved placeholder.
- `services/auth-service`: registration, login, and profile.
- `services/user-service`: user listing, lookup, and update.
- `services/request-service`: buyer request creation and request listing.
- `services/supplier-service`: supplier creation and listing.
- `services/matching-service`: rule-based supplier matching.
- `services/project-service`: project creation and status updates.
- `packages/types`: shared domain type definitions.
- `packages/config`: shared port and JWT defaults.
- `packages/ui`: small shared React components.
- `infra/db`: PostgreSQL schema and seed data.
- `infra/docker`: shared Dockerfiles for services and Next.js apps.
- `infra/nginx`: minimal reverse proxy configuration.

## Layer Separation

The repo has a clear physical separation between apps, services, packages, and infrastructure. That is a good long-term foundation.

The logical separation is weaker:

- Controllers directly execute SQL.
- Business rules are embedded in controllers and service methods.
- Authentication guard logic is copied between services.
- Data transfer objects exist, but there is no domain layer or repository layer.
- Frontend clients call each service directly by port instead of through an API gateway or backend-for-frontend.

Recommended target layering:

- Controller layer: request/response mapping only.
- Application layer: use cases and orchestration.
- Domain layer: business rules such as trust score, matching, request lifecycle, and project lifecycle.
- Infrastructure layer: PostgreSQL repositories, Redis, queues, external integrations.
- Shared platform layer: auth guard, request context, logging, validation, error shape, configuration.

## Service Boundaries

The intended service split is sensible for the future, but the current data ownership model is not yet mature.

Recommended service ownership:

- Auth service owns credentials, login, token issuance, password reset, session policy.
- User service owns profile, roles, trust score read model, and identity metadata.
- Supplier service owns supplier profiles, verification state, capabilities, product categories, and compliance data.
- Request service owns buyer demand objects and request lifecycle.
- Matching service owns match generation, scoring, ranking, and match audit records.
- Project service owns accepted matches, project lifecycle, completion, failure, and outcome evidence.

Current boundary issues:

- Multiple services update `users.trust_score`.
- Supplier creation can be called by any authenticated user and inserts a supplier row for that user.
- Project creation accepts buyer and supplier IDs directly without checking request ownership or accepted match state.
- Matching service reads all suppliers and writes matches directly.
- Admin app depends on service ports and shared browser token behavior rather than a dedicated admin API.

## Dependency Analysis

Current direct dependencies:

- All services depend on PostgreSQL.
- Most services depend on JWT verification.
- Frontend apps depend directly on all backend service URLs.
- Redis is present in Docker but unused by the application.
- Shared packages exist but are minimally used.

Risks:

- Database schema changes can break multiple services at once.
- Authorization behavior can drift between copied guards.
- Frontend apps become coupled to internal service topology.
- Running multiple service instances can duplicate matching writes without idempotency beyond the supplier/request unique constraint.

Recommended dependency direction:

- Apps call an API gateway or BFF.
- Gateway forwards to services or composes read models.
- Services own their tables or schemas.
- Cross-service changes happen through events or explicit service APIs.
- Shared packages contain only stable platform contracts, not mutable business logic that creates deployment coupling.

## Production Readiness Assessment

MVP readiness: Medium.

Production readiness: Low.

Primary blockers:

- No centralized authorization model.
- No service-to-service authentication.
- No migrations system beyond `init.sql`.
- No tests.
- No observability.
- No health checks.
- No secret management.
- No environment-specific configuration.
- Shared database coupling across services.

## Recommended Architecture Direction

Phase the platform toward a modular monolith or service-oriented architecture before fully committing to independent microservices. The current service folders can remain, but shared primitives should be standardized first.

Immediate architectural priorities:

1. Introduce a shared backend platform package for auth guards, roles, request context, errors, logging, and database config.
2. Add an API gateway or BFF to shield frontend apps from internal service topology.
3. Add migrations with a tool such as Prisma Migrate, Drizzle, Knex, Flyway, or Liquibase.
4. Move direct SQL out of controllers.
5. Define service ownership of tables and trust score updates.
6. Add automated tests around auth, request creation, matching, and admin reads.
