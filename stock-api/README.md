# Stock API

FastAPI service for stock data using yfinance.

## Features

- Stock search
- Real-time quotes
- Historical data
- Multiple timeframes

## Environment Configuration

### Optional Variables

```bash
ENV=development    # development/production
PORT=8001          # Server port
```

## Structure

```
src/
├── config/         # Settings
├── controllers/    # API endpoints
├── dto/           # Data models
├── middleware/    # Request/response handling
├── services/      # Business logic
└── utils/         # Helper functions
```

## Development

```bash
pip install -r requirements.txt
python main.py
```

## API

All endpoints are versioned under `/api/v1/*` (e.g., `/api/v1/search`, `/api/v1/health`).
