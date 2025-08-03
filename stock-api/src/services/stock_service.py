import yfinance as yf
import time
from typing import List
from ..dto.stock import (
    StockOverview,
    StockSearch,
    StockBasic,
    StockHistory,
    HistoricalDataPoint,
)
from ..utils.errors import NotFound, BadRequest, InternalServerError
from ..config.settings import CACHE_DURATION, MIN_QUERY_LENGTH


class StockService:
    def __init__(self):
        self.overview_cache = {}
        self.search_cache = {}
        self.history_cache = {}

    def search_stocks(self, query: str, limit: int = 10) -> List[StockSearch]:
        if len(query) < MIN_QUERY_LENGTH:
            raise BadRequest("Query too short")

        cache_key = f"{query}:{limit}"
        if cache_key in self.search_cache:
            cached_data, timestamp = self.search_cache[cache_key]
            if time.time() - timestamp < CACHE_DURATION:
                return cached_data

        try:
            search = yf.Search(query, max_results=limit)
            results = []

            for quote in search.quotes:
                symbol = quote.get("symbol", "")
                name = quote.get("shortname") or quote.get("longname", "")
                quote_type = quote.get("quoteType", "")

                if symbol and name:
                    results.append(StockSearch(symbol=symbol, name=name))

            self.search_cache[cache_key] = (results, time.time())
            return results

        except Exception as e:
            raise InternalServerError(f"Search failed: {str(e)}")

    def get_stock_basic(self, symbol: str) -> StockBasic:
        symbol = symbol.upper()

        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info

            if not info or info.get("regularMarketPrice") is None:
                # Try fast_info as fallback
                fast_info = ticker.fast_info
                current_price = getattr(fast_info, "last_price", None)
            else:
                current_price = info.get("regularMarketPrice")

            name = info.get("longName", info.get("shortName", symbol))
            sector = info.get("sector")

            return StockBasic(
                symbol=symbol,
                name=name,
                current_price=float(current_price) if current_price else None,
                sector=sector,
            )

        except Exception as e:
            raise InternalServerError(f"Stock basic failed: {str(e)}")

    def get_stock_overview(self, symbol: str) -> StockOverview:
        symbol = symbol.upper()

        if symbol in self.overview_cache:
            cached_data, timestamp = self.overview_cache[symbol]
            if time.time() - timestamp < CACHE_DURATION:
                return cached_data

        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info

            if not info:
                raise NotFound("Symbol not found")

            current_price = info.get("regularMarketPrice")
            if current_price is None:
                # Fallback to fast_info
                fast_info = ticker.fast_info
                current_price = getattr(fast_info, "last_price", None)

            if current_price is None:
                raise NotFound("Price data not available")

            name = info.get("longName", info.get("shortName", symbol))
            sector = info.get("sector")

            overview = StockOverview(
                symbol=symbol,
                name=name,
                current_price=float(current_price),
                sector=sector,
            )

            self.overview_cache[symbol] = (overview, time.time())
            return overview

        except NotFound:
            raise
        except Exception as e:
            raise InternalServerError(f"Stock overview failed: {str(e)}")

    def get_stock_history(self, symbol: str, period: str = "1y") -> StockHistory:
        symbol = symbol.upper()
        cache_key = f"{symbol}:{period}"

        if cache_key in self.history_cache:
            cached_data, timestamp = self.history_cache[cache_key]
            if time.time() - timestamp < CACHE_DURATION:
                return cached_data

        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)

            if hist.empty:
                raise NotFound("No historical data available")

            historical_points = [
                HistoricalDataPoint(date=date.strftime("%Y-%m-%d"), close=float(close))
                for date, close in hist["Close"].items()
            ]

            history = StockHistory(symbol=symbol, period=period, data=historical_points)

            self.history_cache[cache_key] = (history, time.time())
            return history

        except NotFound:
            raise
        except Exception as e:
            raise InternalServerError(f"History failed: {str(e)}")


stock_service = StockService()
