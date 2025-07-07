from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from datetime import datetime, timedelta
from typing import Dict, List, Any
import logging
import time
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Stock Price API",
    description="Get stock prices for the past 30 days",
    version="1.0.0",
)

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    """Root endpoint with API information."""
    return {
        "message": "Stock Price API",
        "usage": "GET /{symbol} to get 30 days of stock data",
        "example": "/AAPL for Apple stock data",
    }


@app.get("/{symbol}")
def get_stock_data(symbol: str) -> Dict[str, Any]:
    """
    Get stock price data for the past 30 days.

    Args:
        symbol: Stock symbol (e.g., AAPL, GOOGL, TSLA)

    Returns:
        Dictionary containing stock data with prices for the past 30 days
    """
    try:
        # Validate symbol format (basic validation)
        symbol = symbol.upper().strip()
        if not symbol or len(symbol) > 10:
            raise HTTPException(status_code=400, detail="Invalid stock symbol format")

        logger.info(f"Fetching data for symbol: {symbol}")

        # Calculate date range (30 days ago to today)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)

        # Create ticker object
        ticker = yf.Ticker(symbol)

        # Fetch historical data for the past 30 days with retry logic
        hist = None
        max_retries = 3
        for attempt in range(max_retries):
            try:
                hist = ticker.history(start=start_date, end=end_date)
                if not hist.empty:
                    break
                logger.warning(f"Attempt {attempt + 1}: No data returned for {symbol}")
                time.sleep(1)  # Wait before retry
            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} failed for {symbol}: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(1)
                else:
                    raise

        if hist is None or hist.empty:
            # Try alternative method using period instead of date range
            try:
                logger.info(f"Trying alternative method for {symbol}")
                hist = ticker.history(period="1mo")
            except Exception as e:
                logger.error(f"Alternative method also failed for {symbol}: {str(e)}")

        if hist is None or hist.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for symbol '{symbol}'. Please check if the symbol is valid or try again later.",
            )

        # Get basic info about the stock
        try:
            info = ticker.info
            company_name = info.get("longName", symbol)
            currency = info.get("currency", "USD")
        except:
            # Fallback if info is not available
            company_name = symbol
            currency = "USD"

        # Format the data
        price_data = []
        for date, row in hist.iterrows():
            price_data.append(
                {
                    "date": date.strftime("%Y-%m-%d"),
                    "open": round(float(row["Open"]), 2),
                    "high": round(float(row["High"]), 2),
                    "low": round(float(row["Low"]), 2),
                    "close": round(float(row["Close"]), 2),
                    "volume": int(row["Volume"]),
                }
            )

        # Calculate some basic statistics
        closes = [day["close"] for day in price_data]
        current_price = closes[-1] if closes else 0
        start_price = closes[0] if closes else 0
        price_change = current_price - start_price
        price_change_percent = (price_change / start_price * 100) if start_price else 0

        response_data = {
            "symbol": symbol,
            "company_name": company_name,
            "currency": currency,
            "period": "30 days",
            "data_points": len(price_data),
            "current_price": current_price,
            "start_price": start_price,
            "price_change": round(price_change, 2),
            "price_change_percent": round(price_change_percent, 2),
            "highest_price": round(max(closes), 2) if closes else 0,
            "lowest_price": round(min(closes), 2) if closes else 0,
            "price_data": price_data,
        }

        logger.info(f"Successfully fetched {len(price_data)} data points for {symbol}")
        return response_data

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error fetching data for {symbol}: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch stock data: {str(e)}"
        )


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
