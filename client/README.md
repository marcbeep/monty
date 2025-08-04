# Monty - Portfolio Management App

A modern portfolio management application built with Next.js, Express, and Python.

## Architecture

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Express.js with TypeScript
- **Stock API**: Python FastAPI with yfinance
- **Database**: Supabase (PostgreSQL)

## API Configuration

The app automatically detects the environment and configures API endpoints:

- **Local**: `localhost:3001`
- **Remote**: `api.monty.marc.tt`

Override: `NEXT_PUBLIC_API_URL=http://localhost:3001`

## Development

```bash
npm install
npm run dev    # http://localhost:3000
```
