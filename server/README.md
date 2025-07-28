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

### Authentication

- `POST /api/v1/auth/login|signup|logout`
- `GET /api/v1/auth/me`

### Portfolios

- `GET /api/v1/portfolios` - List user portfolios
- `GET /api/v1/portfolios/:id` - Get specific portfolio
- `POST /api/v1/portfolios` - Create portfolio
- `PUT /api/v1/portfolios/:id` - Update portfolio
- `DELETE /api/v1/portfolios/:id` - Delete portfolio

### System

- `GET /api/v1/health` - Health check
