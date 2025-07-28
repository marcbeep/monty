# Stock API

FastAPI service for market data.

## Structure

```
src/
├── controllers/     # Route handlers
├── services/        # Business logic
├── dto/            # Request/Response models
├── middleware/     # Error handling
├── config/         # Settings
└── utils/          # Helpers & data
```

## Standards

- Responses: `{success: true, data: result}`
- Errors: Factory functions (`BadRequest()`, `NotFound()`)
- No verbose code or comments

## Endpoints

- `GET /api/search?q={query}`
- `GET /api/quote/{symbol}`
- `POST /api/quotes`

## Usage

```bash
python main.py    # http://localhost:8001
```
