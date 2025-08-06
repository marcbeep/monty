# Scenario API

FastAPI service for portfolio scenario analysis and Monte Carlo simulations.

## Features

- Stress testing (historical & scenario-based)
- Monte Carlo simulations
- Risk analytics and projections
- Portfolio performance modeling

## Environment Configuration

### Optional Variables

```bash
ENV=development    # development/production
PORT=8002          # Server port
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
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

## API Endpoints

- `POST /api/stress-test` - Run portfolio stress test
- `POST /api/monte-carlo` - Run Monte Carlo simulation
- `GET /api/health` - Health check
