# Stock Price API Server

A FastAPI server that provides stock price data for the past 30 days using Yahoo Finance data.

## Features

- Dynamic stock symbol endpoints (e.g., `/AAPL`, `/GOOGL`, `/TSLA`)
- Returns 30 days of historical stock data
- Includes price statistics and company information
- CORS enabled for frontend integration
- Error handling for invalid symbols
- Health check endpoint

## Setup

1. **Install Dependencies**

   ```bash
   cd server
   pip install -r requirements.txt
   ```

2. **Run the Server**

   ```bash
   python main.py
   ```

   Or using uvicorn directly:

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The server will start on `http://localhost:8000`

## API Endpoints

### GET /

Returns API information and usage instructions.

### GET /{symbol}

Get stock price data for the specified symbol.

**Parameters:**

- `symbol` (path parameter): Stock symbol (e.g., AAPL, GOOGL, TSLA)

**Example Request:**

```bash
curl http://localhost:8000/AAPL
```

**Example Response:**

```json
{
  "symbol": "AAPL",
  "company_name": "Apple Inc.",
  "currency": "USD",
  "period": "30 days",
  "data_points": 22,
  "current_price": 150.25,
  "start_price": 145.3,
  "price_change": 4.95,
  "price_change_percent": 3.41,
  "highest_price": 152.8,
  "lowest_price": 143.2,
  "price_data": [
    {
      "date": "2024-01-01",
      "open": 145.3,
      "high": 147.2,
      "low": 144.8,
      "close": 146.5,
      "volume": 25000000
    }
    // ... more daily data
  ]
}
```

### GET /health

Health check endpoint.

## Data Source

This API uses the `yfinance` library to fetch data from Yahoo Finance. The data includes:

- Daily open, high, low, close prices
- Trading volume
- Company information
- Price statistics for the 30-day period

## Error Handling

- **400 Bad Request**: Invalid stock symbol format
- **404 Not Found**: No data found for the symbol
- **500 Internal Server Error**: API or server errors

## CORS Configuration

The server is configured to allow requests from:

- `http://localhost:3000`
- `http://127.0.0.1:3000`

Modify the `allow_origins` in `main.py` to add your frontend URL.

## Usage with Frontend

You can easily integrate this with your Next.js frontend by making fetch requests:

```javascript
const fetchStockData = async (symbol) => {
  try {
    const response = await fetch(`http://localhost:8000/${symbol}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
  }
};
```

## Popular Stock Symbols

- **AAPL** - Apple Inc.
- **GOOGL** - Alphabet Inc.
- **MSFT** - Microsoft Corporation
- **TSLA** - Tesla Inc.
- **AMZN** - Amazon.com Inc.
- **META** - Meta Platforms Inc.
- **NVDA** - NVIDIA Corporation
