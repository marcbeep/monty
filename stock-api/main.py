from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
import yfinance as yf
from symbols import search_symbols
import time

app = FastAPI(title="Stock API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.marc.tt"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory cache
quote_cache = {}
CACHE_DURATION = 300  # 5 minutes


class StockSearch(BaseModel):
    symbol: str
    name: str
    type: str


class StockQuote(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    market_cap: Optional[float] = None


class SearchResponse(BaseModel):
    results: List[StockSearch]


class BatchQuoteRequest(BaseModel):
    symbols: List[str]


class BatchQuoteResponse(BaseModel):
    quotes: List[StockQuote]
    errors: List[str]


@app.get("/")
async def root():
    return {"message": "Stock API is running"}


@app.get("/search", response_model=SearchResponse)
async def search_stocks(q: str, limit: int = 10):
    if len(q) < 2:
        raise HTTPException(status_code=400, detail="Query too short")

    try:
        # Use static symbol search (no API calls)
        symbols = search_symbols(q, limit)
        results = [StockSearch(symbol=s[0], name=s[1], type=s[2]) for s in symbols]
        return SearchResponse(results=results)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@app.get("/quote/{symbol}", response_model=StockQuote)
async def get_quote(symbol: str):
    symbol = symbol.upper()

    # Check cache first
    if symbol in quote_cache:
        cached_data, timestamp = quote_cache[symbol]
        if time.time() - timestamp < CACHE_DURATION:
            return cached_data

    try:
        ticker = yf.Ticker(symbol)

        # Get minimal data to avoid rate limits
        hist = ticker.history(period="5d", interval="1d")

        if hist.empty:
            raise HTTPException(status_code=404, detail="Symbol not found")

        current_price = hist["Close"].iloc[-1]
        prev_close = hist["Close"].iloc[-2] if len(hist) > 1 else current_price

        change = current_price - prev_close
        change_percent = (change / prev_close) * 100 if prev_close else 0

        # Try to get name from info, but don't fail if rate limited
        name = symbol
        try:
            info = ticker.info
            name = info.get("longName", info.get("shortName", symbol))
        except:
            pass  # Use symbol as name if info fails

        quote = StockQuote(
            symbol=symbol,
            name=name,
            price=round(float(current_price), 2),
            change=round(float(change), 2),
            change_percent=round(float(change_percent), 2),
            market_cap=None,
        )

        # Cache the result
        quote_cache[symbol] = (quote, time.time())
        return quote

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quote failed: {str(e)}")


@app.post("/quotes", response_model=BatchQuoteResponse)
async def get_batch_quotes(request: BatchQuoteRequest):
    if len(request.symbols) > 10:
        raise HTTPException(status_code=400, detail="Max 10 symbols per request")

    quotes = []
    errors = []

    for symbol in request.symbols:
        try:
            quote = await get_quote(symbol)
            quotes.append(quote)
        except HTTPException as e:
            errors.append(f"{symbol}: {e.detail}")
        except Exception as e:
            errors.append(f"{symbol}: {str(e)}")

    return BatchQuoteResponse(quotes=quotes, errors=errors)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)
