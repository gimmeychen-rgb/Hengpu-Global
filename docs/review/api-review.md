# API Review

## Executive Summary

The APIs cover the MVP acceptance flow: register, login, create request, list suppliers, return matches, and view admin data. The main API concerns are inconsistent REST naming, incomplete authorization, inconsistent error responses, and missing pagination/status-code discipline.

## REST Consistency

Current routes:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/profile`
- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `POST /requests/create`
- `GET /requests`
- `GET /requests/:id`
- `POST /suppliers/create`
- `GET /suppliers`
- `GET /suppliers/:id`
- `GET /requests/:id/matches`
- `GET /matches/request/:id`
- `POST /projects/create`
- `GET /projects`
- `PATCH /projects/:id/status`

Recommendations:

- Replace `POST /requests/create` with `POST /requests`.
- Replace `POST /suppliers/create` with `POST /suppliers`.
- Replace `POST /projects/create` with `POST /projects`.
- Keep one canonical match endpoint, preferably `GET /requests/:id/matches`.
- Introduce API versioning, for example `/v1/requests`.

## Status Codes

Current behavior:

- Nest returns normal success codes for most responses.
- Some not-found cases return `null` with `200`.
- Some forbidden cases return an error object with `200`.

Recommendations:

- Return `404` for missing users, requests, suppliers, projects.
- Return `403` with `ForbiddenException` for unauthorized role actions.
- Return `409` for duplicate email registration.
- Return `201` for created resources.
- Return `400` for invalid request body.
- Standardize error responses.

## Validation

Strengths:

- DTO validation exists for major write endpoints.
- Global validation pipes are enabled in service `main.ts` files.
- Budget minimum and maximum are checked in both DTO and controller/database.

Gaps:

- String lengths are not constrained.
- Supplier `product_categories` validates only as array, not as allowed category values.
- UUID route params are not validated.
- Query params are not strongly validated.
- Admin data fetches have no filtering or pagination validation.

Recommendations:

- Add `ParseUUIDPipe` for ID params.
- Add length constraints for names, descriptions, country, and company fields.
- Validate supplier categories against allowed categories or a category table.
- Add DTOs for query parameters.
- Add pagination defaults and maximum limits.

## Authentication

Current state:

- Auth service issues JWTs.
- Most protected services verify JWTs independently.
- Public supplier and request listing endpoints exist.
- Admin app uses the same token mechanism as the web app.

Concerns:

- Copied JWT guards can drift.
- No refresh token or session revocation strategy.
- No service-to-service authentication.
- JWT secret defaults to a hard-coded local value.

Recommendations:

- Centralize JWT verification in a shared backend package.
- Add token issuer, audience, and key rotation strategy.
- Add refresh-token or short-lived access-token model before production.
- Add internal service identity for service-to-service calls.

## Authorization

Current authorization:

- Buyers only can create requests.
- User updates allow admin or self.
- Other write endpoints are lightly guarded or not role-specific.

Major gaps:

- Admin endpoints are not truly admin-only at API level.
- Any authenticated user can call project creation.
- Any authenticated user can create a supplier profile.
- User list is available to any authenticated user.
- Supplier `verified` can be set by the caller.

Recommendations:

- Add role decorators and guards to every protected endpoint.
- Enforce admin-only access for user list and admin aggregate views.
- Restrict supplier verification to admins or verification agents.
- Enforce ownership checks for request/project actions.
- Define an authorization matrix per role.

## API Contract Quality

The requested JSON contract is implemented at a basic level. The match response shape matches the MVP requirement:

```json
{
  "request_id": "",
  "matches": [
    {
      "supplier_id": "",
      "score": 0
    }
  ]
}
```

Recommendations:

- Document all request/response schemas in OpenAPI.
- Generate clients from the API contract or share types rigorously.
- Add contract tests for web/admin compatibility.

## Frontend API Usage

The frontend calls service ports directly. This is simple for local MVP but creates deployment and security coupling.

Recommendations:

- Introduce a gateway or BFF.
- Keep service URLs server-side where possible.
- Avoid exposing internal service topology through `NEXT_PUBLIC_*` for production deployments.
