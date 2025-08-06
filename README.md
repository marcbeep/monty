# Monty

Portfolio backtesting and analysis platform.
This project uses a Hub and Spoke model with the server being the Hub.

## Services

- **client/** - Next.js frontend
- **server/** - Node.js API (auth, portfolios)
- **stock-api/** - Python API (market data)
- **scenario-api/** - Python API (backtesting, simulations)

## Structure

```
monty/
├── client/          # Next.js app
├── server/          # Node.js API
├── stock-api/       # FastAPI service
├── scenario-api/    # FastAPI service
└── README.md
```

## Stack

- **Frontend**: Next.js, TypeScript, Tailwind
- **Backend**: Node.js, Express, Supabase
- **Data**: Python, FastAPI, yfinance
- **Analytics**: Python, FastAPI, numpy, pandas, scipy
- **Auth**: Supabase Auth
- **Database**: PostgreSQL (Supabase)

## API Versioning

All services use `/api/v1` versioning following Hub-and-Spoke architecture:

- Client → Server Hub (`/api/v1/*`)
- Server Hub → Spoke Services (`/api/v1/*`)
