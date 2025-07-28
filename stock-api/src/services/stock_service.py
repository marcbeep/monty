import yfinance as yf
import time
from typing import List
from ..dto.stock import StockOverview, StockSearch
from ..utils.errors import NotFound, BadRequest, InternalServerError
from ..config.settings import CACHE_DURATION, MIN_QUERY_LENGTH


class StockService:
    def __init__(self):
        self.overview_cache = {}

    def search_stocks(self, query: str, limit: int = 10) -> List[StockSearch]:
        if len(query) < MIN_QUERY_LENGTH:
            raise BadRequest("Query too short")

        try:
            from ..utils.symbols import search_symbols

            symbols = search_symbols(query, limit)
            return [StockSearch(symbol=s[0], name=s[1], type=s[2]) for s in symbols]
        except Exception as e:
            raise InternalServerError(f"Search failed: {str(e)}")

    def get_stock_overview(self, symbol: str) -> StockOverview:
        symbol = symbol.upper()

        if symbol in self.overview_cache:
            cached_data, timestamp = self.overview_cache[symbol]
            if time.time() - timestamp < CACHE_DURATION:
                return cached_data

        try:
            ticker = yf.Ticker(symbol)

            # Get basic info using the latest yfinance API
            info = ticker.info

            # Get recent price history
            hist = ticker.history(period="5d", interval="1d")

            if hist.empty:
                raise NotFound("Symbol not found")

            current_price = hist["Close"].iloc[-1]
            previous_close = hist["Close"].iloc[-2] if len(hist) > 1 else current_price
            change = current_price - previous_close
            change_percent = (change / previous_close) * 100 if previous_close else 0

            # Extract comprehensive data from ticker.info
            name = info.get("longName", info.get("shortName", symbol))
            market_cap = info.get("marketCap")
            volume = info.get("volume")
            avg_volume = info.get("averageVolume")
            day_high = info.get("dayHigh")
            day_low = info.get("dayLow")
            year_high = info.get("fiftyTwoWeekHigh")
            year_low = info.get("fiftyTwoWeekLow")
            pe_ratio = info.get("trailingPE")
            dividend_yield = info.get("dividendYield")
            sector = info.get("sector")
            industry = info.get("industry")

            # Convert dividend yield from decimal to percentage if it exists
            if dividend_yield:
                dividend_yield = dividend_yield * 100

            overview = StockOverview(
                symbol=symbol,
                name=name,
                current_price=round(float(current_price), 2),
                previous_close=round(float(previous_close), 2),
                change=round(float(change), 2),
                change_percent=round(float(change_percent), 2),
                market_cap=market_cap,
                volume=volume,
                avg_volume=avg_volume,
                day_high=day_high,
                day_low=day_low,
                year_high=year_high,
                year_low=year_low,
                pe_ratio=pe_ratio,
                dividend_yield=dividend_yield,
                sector=sector,
                industry=industry,
            )

            self.overview_cache[symbol] = (overview, time.time())
            return overview

        except NotFound:
            raise
        except Exception as e:
            raise InternalServerError(f"Stock overview failed: {str(e)}")


stock_service = StockService()
