# Monty Portfolio Backtester API

A Node.js TypeScript backend for portfolio backtesting and analysis.

## Tech Stack

- **Node.js** with **TypeScript** for type safety
- **Express.js** for the web framework
- **Supabase** for database and authentication
- **Zod** for schema validation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
# Copy and update with your values
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
PORT=8000
```

### Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:8000`

### Production

Build and start:

```bash
npm run build
npm start
```

## API Endpoints

### Health Checks

- `GET /health` - Main health check
- `GET /healthz` - Kubernetes-style health check
- `GET /ping` - Simple ping/pong

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Core Features

- `GET /api/dashboard` - Dashboard data
- `GET /api/portfolios` - Portfolio management
- `GET /api/assets` - Asset data
- `GET /api/backtester` - Backtesting functionality
- `GET /api/comparison` - Portfolio comparison
- `GET /api/settings` - User settings

## Project Structure

```
src/
├── api/           # API route handlers
├── core/          # Core configuration and database
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Configuration

The server uses environment variables for configuration. All settings are validated at startup using Zod schemas.

Required environment variables:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_KEY` - Your Supabase anon/public key

Optional:

- `PORT` - Server port (default: 8000)
