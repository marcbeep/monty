# Stock API

FastAPI service for stock search and quotes using yfinance.

## Setup

```bash
pip install -r requirements.txt
python main.py
```

## Endpoints

- `GET /search?q=apple&limit=10` - Search stocks
- `GET /quote/AAPL` - Get stock quote
- `GET /` - Health check

## Usage

```bash
curl "http://localhost:8001/search?q=apple"
curl "http://localhost:8001/quote/AAPL"
```
