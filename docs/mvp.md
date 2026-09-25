# Hengpu Platform MVP

## Services

- Web app: http://localhost:3000
- Admin app: http://localhost:3010/admin/users
- Auth service: http://localhost:3001
- User service: http://localhost:3002
- Request service: http://localhost:3003
- Supplier service: http://localhost:3004
- Matching service: http://localhost:3005
- Project service: http://localhost:3006

## Run

```bash
docker compose up --build
```

## MVP Flow

1. Register a buyer at `/register`.
2. Create a request at `/requests/create`.
3. View matches at `/requests/:id/matches`.
4. View all entities in the admin app.
