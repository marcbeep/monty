# Monty - Portfolio Management App

A modern portfolio management application built with Next.js, Express, and Python.

## Architecture

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Express.js with TypeScript
- **Stock API**: Python FastAPI with yfinance
- **Database**: Supabase (PostgreSQL)

## Environment Configuration

### Development

```bash
ENV=development
```

### Production

```bash
ENV=production
NEXT_PUBLIC_API_URL=your_api_url  # Required
```

## Development

```bash
npm install
npm run dev
```
