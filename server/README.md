# Server

Node.js API for authentication and portfolios.

## Structure

```
src/
├── controllers/     # Route handlers
├── services/        # Business logic
├── middleware/      # Auth, validation, errors
├── config/          # Environment & DB
└── database/        # SQL schemas
```

## Setup

1. Run `src/database/*.sql` in Supabase
2. Create `.env`: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
3. `npm install && npm run dev`

## Endpoints

- `POST /api/v1/auth/login|signup|logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/portfolios`
- `GET /api/v1/health`
