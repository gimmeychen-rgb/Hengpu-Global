# Scalability Review

## Executive Summary

The current system can support MVP demos and small test data sets. It is not yet ready for large supplier catalogs, high request volume, or complex project workflows. The primary scalability constraints are shared database coupling, direct full-table matching, lack of pagination, no caching, no queueing, and no read model strategy.

## Future Microservice Readiness

Strengths:

- Services are already physically separated.
- Docker Compose can run each service independently.
- Domains are named in a way that can grow into real service ownership.

Weaknesses:

- All services share one schema directly.
- Cross-domain writes happen directly in SQL.
- No asynchronous communication.
- No service discovery or gateway.
- No contract testing between services.

Recommendations:

- Introduce a gateway/BFF before exposing services.
- Split database ownership by schema first, then by database only when operational maturity supports it.
- Use service APIs or domain events for cross-service updates.
- Add consumer-driven contract tests.

## Event-Driven Opportunities

Good future events:

- `UserRegistered`
- `BuyerProfileCompleted`
- `SupplierProfileCreated`
- `SupplierVerified`
- `RequestCreated`
- `RequestUpdated`
- `MatchGenerated`
- `MatchAccepted`
- `ProjectCreated`
- `ProjectStatusChanged`
- `ProjectClosed`
- `TrustScoreChanged`

Recommended event uses:

- Recalculate matches when requests or suppliers change.
- Update trust score through a single trust service or user-domain handler.
- Build admin read models without heavy joins.
- Trigger notifications later without coupling workflows.
- Maintain audit history for compliance-heavy government and mining workflows.

## Caching

Redis exists in Docker but is not used.

Near-term caching candidates:

- Supplier lists.
- Request lists.
- Match results by request ID.
- User profile from token subject.
- Admin dashboard aggregates.

Cache invalidation events:

- Supplier profile update.
- Request creation/update.
- Trust score change.
- Project status change.

Recommendations:

- Start with explicit cache-aside for match results.
- Add TTLs for low-risk read data.
- Avoid caching authorization decisions until the role model is stable.

## Queue Recommendations

Recommended queue-backed jobs:

- Match generation.
- Trust score recalculation.
- Supplier verification workflows.
- Email notifications.
- Data import/export.
- CRM and ERP sync.
- AI enrichment tasks.

Technology options:

- BullMQ with Redis for near-term Node.js simplicity.
- RabbitMQ for durable domain events and routing.
- Kafka only when event volume and analytics requirements justify the operational cost.

Recommended first step:

- Add BullMQ workers for matching and trust score recalculation after the synchronous MVP flow is stable.

## Database Scalability

Current risks:

- No pagination.
- Full supplier scan in matching service.
- Array category matching may become inefficient without a GIN index.
- No timestamps for incremental sync or cache invalidation.
- No read replicas or read model separation.

Recommendations:

- Add pagination and sort keys.
- Add query indexes listed in `database-review.md`.
- Add timestamps to mutable tables.
- Pre-filter matching candidates in SQL.
- Add materialized views or denormalized read tables for admin views later.

## Frontend Scalability

Current frontend apps are small and direct.

Risks:

- Apps call all services directly.
- Token handling is duplicated.
- Admin and web apps duplicate table and API handling patterns.
- No loading/error boundary strategy.

Recommendations:

- Use a typed API client.
- Add route-level auth handling.
- Centralize data fetching patterns.
- Use server-side proxy routes or a BFF for production.

## Operational Scalability

Missing production capabilities:

- Health checks.
- Metrics.
- Structured logs.
- Distributed tracing.
- CI/CD.
- Database migrations.
- Backups.
- Environment separation.

Recommended observability baseline:

- Service health endpoint.
- Request latency and error metrics.
- Database pool metrics.
- Matching job duration metrics.
- Audit logs for security-sensitive operations.

## Scalability Priority List

High:

- Pagination.
- Database indexes.
- Gateway/BFF.
- Migrations.
- Health checks and structured logs.

Medium:

- Redis cache for match results.
- Background queue for match generation.
- Event model for trust and projects.
- Admin read models.

Low:

- Multi-database deployment.
- Kafka-scale streaming.
- Complex autoscaling policies.
