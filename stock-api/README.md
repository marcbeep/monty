# Stock API

Clean, structured FastAPI service for stock market data.

## Structure

```
src/
├── config/         # Settings and configuration
├── controllers/    # API route handlers
├── dto/           # Request/Response models
├── middleware/    # Error handling middleware
├── services/      # Business logic
└── utils/         # Shared utilities
```

## Standards

- **Responses**: `{success: true, data: result}` or `{success: false, error: "message"}`
- **Errors**: Factory functions (`BadRequest()`, `NotFound()`, etc.)
- **Validation**: Pydantic models
- **No**: Verbose comments, duplicate types, repository patterns

## API Endpoints

- `GET /` - Health check
- `GET /api/search?q={query}&limit={limit}` - Search stocks
- `GET /api/quote/{symbol}` - Get stock quote
- `POST /api/quotes` - Batch quotes

## Usage

```bash
python main.py
# API runs on http://localhost:8001
```
