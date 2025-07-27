# Monty Server

This server is written in FastAPI and provides a modular API structure for the Monty portfolio backtester.

## Setup

1. **Install Dependencies**

   ```bash
   cd server
   pip install -r requirements.txt
   ```

2. **Environment Configuration**

   Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Run the Server**

   ```bash
   python main.py
   ```

   Or using uvicorn directly:

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The server will start on `http://localhost:8000`

## API Documentation

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## CORS Configuration

The server is configured to allow requests from:

- `http://localhost:3000`
- `http://127.0.0.1:3000`

Modify the `allowed_origins` in `app/core/config.py` to add your frontend URL.

## Directory Structure

```
server/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Dependencies
├── .env                    # Environment variables
├── .env.example           # Environment template
├── README.md              # Project documentation
│
├── app/
│   ├── __init__.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py      # Settings & environment
│   │   └── database.py    # Supabase connection
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── dashboard.py   # Dashboard endpoints
│   │   ├── portfolios.py  # Portfolio CRUD endpoints
│   │   ├── assets.py      # Asset endpoints
│   │   ├── backtester.py  # Backtesting endpoints
│   │   ├── comparison.py  # Portfolio comparison endpoints
│   │   ├── settings.py    # User settings endpoints
│   │   └── auth.py        # Authentication endpoints
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── portfolio.py   # Portfolio model
│   │   ├── backtest.py    # Backtest results model
│   │   ├── scenario.py    # Scenario analysis model
│   │   ├── monte_carlo.py # Monte Carlo results model
│   │   ├── user.py        # User model
│   │   └── settings.py    # User settings model
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── portfolio.py   # Portfolio schemas
│   │   ├── dashboard.py   # Dashboard schemas
│   │   ├── backtester.py  # Backtesting schemas
│   │   ├── comparison.py  # Comparison schemas
│   │   ├── settings.py    # Settings schemas
│   │   ├── auth.py        # Auth schemas
│   │   └── common.py      # Common schemas
│   │
│   └── services/
│       ├── __init__.py
│       ├── portfolio_service.py    # Portfolio calculations
│       ├── backtest_service.py     # Historical backtesting
│       ├── scenario_service.py     # Scenario analysis
│       ├── monte_carlo_service.py  # Monte Carlo simulation
│       ├── comparison_service.py   # Portfolio comparison
│       ├── market_data.py          # Market data (yfinance)
│       └── settings_service.py     # User settings
│
└── tests/
    ├── __init__.py
    ├── test_api.py        # API tests
    └── test_services.py   # Service tests
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Dashboard

- `GET /api/dashboard/{portfolio_id}?timeframe=YTD` - Get dashboard data

### Portfolios

- `GET /api/portfolios` - List all portfolios
- `POST /api/portfolios` - Create a new portfolio
- `PUT /api/portfolios/{id}` - Update a portfolio
- `DELETE /api/portfolios/{id}` - Delete a portfolio

### Assets

- `GET /api/assets` - List available assets
- `GET /api/assets/search?q={query}` - Search assets

### Backtesting

- `GET /api/backtester/historical/{portfolio_id}` - Historical backtest
- `POST /api/backtester/scenarios/{portfolio_id}` - Run scenario analysis
- `POST /api/backtester/monte-carlo/{portfolio_id}` - Monte Carlo simulation
- `GET /api/backtester/scenarios` - List available scenarios

### Comparison

- `GET /api/comparison/{portfolio1_id}/{portfolio2_id}?timeframe=YTD` - Compare portfolios

### Settings

- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings
