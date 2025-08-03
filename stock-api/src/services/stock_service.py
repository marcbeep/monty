import yfinance as yf
import time
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from ..dto.stock import (
    StockOverview,
    StockSearch,
    StockBasic,
    StockHistory,
    HistoricalDataPoint,
)
from ..utils.errors import NotFound, BadRequest, InternalServerError
from ..config.settings import CACHE_DURATION, MIN_QUERY_LENGTH

# Timeframe mapping from UI to yfinance periods
TIMEFRAME_MAPPING: Dict[str, str] = {
    "1D": "1d",
    "5D": "5d",
    "1M": "1mo",
    "6M": "6mo",
    "YTD": "ytd",
    "1Y": "1y",
    "5Y": "5y",
    "Max": "max",
}

# Valid timeframes for validation
VALID_TIMEFRAMES = list(TIMEFRAME_MAPPING.keys())


class StockService:
    def __init__(self):
        self.overview_cache = {}
        self.search_cache = {}
        self.history_cache = {}

    def _validate_and_map_timeframe(self, timeframe: str) -> str:
        """
        Validate timeframe and map to yfinance period.
        Returns the yfinance period string.
        """
        timeframe_upper = timeframe.upper()

        # Create a case-insensitive lookup
        mapping_upper = {k.upper(): v for k, v in TIMEFRAME_MAPPING.items()}

        if timeframe_upper not in mapping_upper:
            raise BadRequest(
                f"Invalid timeframe '{timeframe}'. Valid options: {', '.join(VALID_TIMEFRAMES)}"
            )

        return mapping_upper[timeframe_upper]

    def _get_actual_data_range(
        self, historical_data: List[HistoricalDataPoint]
    ) -> tuple[Optional[str], Optional[str]]:
        """
        Get the actual start and end dates from historical data.
        Returns (start_date, end_date) as strings or (None, None) if no data.
        """
        if not historical_data:
            return None, None

        dates = [point.date for point in historical_data]
        return min(dates), max(dates)

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

    def get_stock_history(self, symbol: str, timeframe: str = "1Y") -> StockHistory:
        """
        Get historical stock data for the specified timeframe.

        Args:
            symbol: Stock symbol (e.g., "AAPL")
            timeframe: One of "1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "Max"

        Returns:
            StockHistory with actual data available for the symbol
        """
        symbol = symbol.upper()
        timeframe_upper = timeframe.upper()

        # Validate and map timeframe
        yf_period = self._validate_and_map_timeframe(timeframe_upper)

        cache_key = f"{symbol}:{timeframe_upper}"

        if cache_key in self.history_cache:
            cached_data, timestamp = self.history_cache[cache_key]
            if time.time() - timestamp < CACHE_DURATION:
                return cached_data

        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=yf_period)

            if hist.empty:
                raise NotFound(
                    f"No historical data available for {symbol} in timeframe {timeframe}"
                )

            # Convert to our format
            historical_points = [
                HistoricalDataPoint(date=date.strftime("%Y-%m-%d"), close=float(close))
                for date, close in hist["Close"].items()
            ]

            # Get actual data range
            actual_start, actual_end = self._get_actual_data_range(historical_points)

            # Create history object with metadata about actual range
            history = StockHistory(
                symbol=symbol,
                period=timeframe_upper,  # Return the original UI timeframe
                data=historical_points,
            )

            self.history_cache[cache_key] = (history, time.time())
            return history

        except NotFound:
            raise
        except BadRequest:
            raise
        except Exception as e:
            raise InternalServerError(f"History failed for {symbol}: {str(e)}")

    def get_data_availability_info(self, symbol: str) -> Dict[str, Optional[str]]:
        """
        Get information about data availability for different timeframes.
        Returns a dict with timeframe -> oldest_available_date mapping.
        """
        symbol = symbol.upper()
        availability = {}

        try:
            ticker = yf.Ticker(symbol)

            # Check max period to get the full range
            max_hist = ticker.history(period="max")
            if not max_hist.empty:
                oldest_date = max_hist.index[0].strftime("%Y-%m-%d")
                newest_date = max_hist.index[-1].strftime("%Y-%m-%d")

                # Calculate which timeframes are fully available
                for ui_timeframe in VALID_TIMEFRAMES:
                    if ui_timeframe == "Max":
                        availability[ui_timeframe] = oldest_date
                    else:
                        # Try to get data for this timeframe
                        try:
                            yf_period = TIMEFRAME_MAPPING[ui_timeframe]
                            hist = ticker.history(period=yf_period)
                            if not hist.empty:
                                availability[ui_timeframe] = hist.index[0].strftime(
                                    "%Y-%m-%d"
                                )
                            else:
                                availability[ui_timeframe] = None
                        except:
                            availability[ui_timeframe] = None

            return availability

        except Exception as e:
            # Return empty availability info on error
            return {tf: None for tf in VALID_TIMEFRAMES}


stock_service = StockService()
