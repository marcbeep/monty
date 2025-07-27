# Monty Server

## Setup

1. Run `src/database/schema.sql` in Supabase SQL editor
2. Create `.env`:

```env
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
```

3. `npm install && npm run dev`

## Features

- Auto-creates 3 starter portfolios on user signup (Conservative, Moderate, Aggressive)

## API

| Method | Path                  | Auth | Description         |
| ------ | --------------------- | ---- | ------------------- |
| POST   | `/api/v1/auth/login`  | No   | User login          |
| POST   | `/api/v1/auth/signup` | No   | User signup         |
| POST   | `/api/v1/auth/logout` | Yes  | User logout         |
| GET    | `/api/v1/auth/me`     | Yes  | Get user profile    |
| GET    | `/api/v1/portfolios`  | Yes  | Get user portfolios |
| GET    | `/api/v1/health`      | No   | Health check        |
