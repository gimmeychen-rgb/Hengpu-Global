# Database Review

## Executive Summary

The schema is compact and suitable for MVP validation. It captures the core entities: users, buyers, suppliers, requests, matches, and projects. The key database concerns are ownership, normalization of supplier categories, missing uniqueness constraints on profile tables, lack of migration management, and limited indexing for future search and matching.

## Table Normalization

### `users`

Good:

- UUID primary key.
- Unique email.
- Role enum.
- Trust score default.

Concerns:

- `trust_score` is updated by several services and does not have an audit trail.
- `password_hash` is required even for seeded suppliers that use a non-bcrypt placeholder.
- Role as a single enum may not support future multi-role users.

Recommendations:

- Add `trust_score_events` table for auditable trust changes.
- Ensure all stored password hashes are valid bcrypt hashes or move seed suppliers to a safer non-login profile model.
- Consider `user_roles` if one user can be both buyer and supplier later.

### `buyers`

Good:

- Separate buyer profile table.
- Foreign key to `users`.

Concerns:

- No uniqueness constraint on `user_id`, allowing multiple buyer profiles for one user.
- Country is plain text and not normalized.

Recommendations:

- Add `UNIQUE (user_id)`.
- Consider standardized country codes.

### `suppliers`

Good:

- Separate supplier profile table.
- Stores verification state.
- Supports multiple product categories.

Concerns:

- No uniqueness constraint on `user_id`.
- `product_categories text[]` is simple but weak for querying, governance, and category metadata.
- `verified` has no verifier, timestamp, or evidence.

Recommendations:

- Add `UNIQUE (user_id)`.
- For near-term MVP, add a GIN index on `product_categories`.
- For long-term growth, normalize into `categories` and `supplier_categories`.
- Add verification audit fields or a separate verification table.

### `requests`

Good:

- Has buyer foreign key.
- Uses category enum.
- Has budget range checks.

Concerns:

- No created/updated timestamps.
- Status enum is minimal.
- Category enum is hard-coded and will become restrictive.
- No search indexes.

Recommendations:

- Add `created_at`, `updated_at`, and optionally `closed_at`.
- Add index on `(status, category, country_target)`.
- Consider normalized category table when categories become dynamic.

### `matches`

Good:

- Links request and supplier.
- Unique constraint on `(request_id, supplier_id)`.
- Stores score and status.

Concerns:

- No timestamp for when a match was generated or updated.
- No score explanation or scoring version.
- Score check only requires non-negative; expected score range is not enforced.

Recommendations:

- Add `created_at`, `updated_at`, `score_version`, and score component columns.
- Add check `score BETWEEN 0 AND 100` if scores remain percentage-like.
- Add index on `(request_id, score DESC)`.

### `projects`

Good:

- Links request, buyer, and supplier.
- Tracks lifecycle status.
- Has `created_at`.

Concerns:

- Does not enforce that project buyer matches request buyer.
- Does not enforce that supplier was matched or accepted.
- No status transition history.
- No updated timestamp.

Recommendations:

- Add application-level and database-level integrity checks where possible.
- Add `project_events` or `project_status_history`.
- Add `updated_at`.

## Foreign Keys

Current foreign keys are present and mostly useful.

Risk:

- `ON DELETE CASCADE` from users to buyers/suppliers and onward to requests/projects can remove business history. For production, deletion of users should usually be soft-delete or anonymization rather than cascading removal of commercial records.

Recommendations:

- Replace destructive cascades with soft-delete policies for commercial entities.
- Keep hard deletes only for local development or test data.
- Add deletion/anonymization procedures for compliance.

## Index Recommendations

Current indexes:

- `users(role)`
- `requests(buyer_id)`
- `matches(request_id)`
- `projects(buyer_id)`
- `projects(supplier_id)`

Recommended additional indexes:

- `buyers(user_id)` unique.
- `suppliers(user_id)` unique.
- `requests(status, category, country_target)`.
- `requests(created_at DESC)` after adding timestamps.
- `matches(request_id, score DESC)`.
- `matches(supplier_id, status)`.
- `projects(request_id)`.
- `suppliers(country)`.
- `suppliers USING GIN (product_categories)` if array categories remain.

## Performance Risks

Matching currently loads all suppliers into application memory, scores them, sorts them, and writes up to five rows. This works for small MVP data but will become expensive as supplier volume grows.

Future matching risks:

- Full-table supplier scans.
- No pagination on list endpoints.
- No filtering or search indexes.
- No materialized read models.
- Recalculation on every match request.

Recommendations:

- Add pagination to all list endpoints.
- Pre-filter suppliers in SQL by category and country where possible.
- Store match runs and reuse results until request or supplier data changes.
- Add event-driven recalculation when supplier profile, trust score, or request changes.

## Migration Strategy

Current schema is managed by `infra/db/init.sql`. This is acceptable for the first local Docker run, but it is not sufficient for production.

Recommendations:

- Adopt a migration tool.
- Version every schema change.
- Separate seed data from schema migrations.
- Add rollback strategy for non-trivial changes.
- Add schema checks in CI.
