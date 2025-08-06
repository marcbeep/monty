# Monty

Portfolio backtesting and analysis platform.

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
