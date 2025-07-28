# Stock API

FastAPI service for real-time market data via Yahoo Finance.

## Structure

```
src/
├── controllers/     # Route handlers
├── services/        # Business logic
├── dto/            # Request/Response models
├── middleware/     # Error handling
├── config/         # Settings
└── utils/          # Helpers
```

## Standards

- Responses: `{success: true, data: result}`
- Errors: Factory functions (`BadRequest()`, `NotFound()`)
- No verbose code or comments

## Endpoints

- `GET /api/search?q={query}&limit={N}` - Real-time stock search
- `GET /api/basic/{symbol}` - Minimal stock data
- `GET /api/quote/{symbol}` - Stock overview (legacy)

## Usage

```bash
python main.py    # http://localhost:8001
```

## Features

- Real Yahoo Finance search (no hardcoded data)
- Smart asset classification (Equities, Fixed Income, Alternatives)
- Cached responses for performance
- Lean data structures for portfolio building
