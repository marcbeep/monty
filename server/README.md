# Monty Server

## Setup

1. Run `src/database/schema.sql` in Supabase SQL editor
2. Create `.env`:

```env
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
```

3. `npm install && npm run dev`

## API

| Method | Path                  | Auth |
| ------ | --------------------- | ---- |
| POST   | `/api/v1/auth/login`  | No   |
| POST   | `/api/v1/auth/signup` | No   |
| POST   | `/api/v1/auth/logout` | Yes  |
| GET    | `/api/v1/auth/me`     | Yes  |
| GET    | `/api/v1/health`      | No   |
