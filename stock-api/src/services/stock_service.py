import yfinance as yf
import time
from typing import List, Tuple
from ..dto.stock import StockQuote, StockSearch
from ..utils.errors import NotFound, BadRequest, InternalServerError
from ..config.settings import CACHE_DURATION, MIN_QUERY_LENGTH


class StockService:
    def __init__(self):
        self.quote_cache = {}

    def search_stocks(self, query: str, limit: int = 10) -> List[StockSearch]:
        if len(query) < MIN_QUERY_LENGTH:
            raise BadRequest("Query too short")

        try:
            from ..utils.symbols import search_symbols

            symbols = search_symbols(query, limit)
            return [StockSearch(symbol=s[0], name=s[1], type=s[2]) for s in symbols]
        except Exception as e:
            raise InternalServerError(f"Search failed: {str(e)}")

    def get_quote(self, symbol: str) -> StockQuote:
        symbol = symbol.upper()

        if symbol in self.quote_cache:
            cached_data, timestamp = self.quote_cache[symbol]
            if time.time() - timestamp < CACHE_DURATION:
                return cached_data

        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="5d", interval="1d")

            if hist.empty:
                raise NotFound("Symbol not found")

            current_price = hist["Close"].iloc[-1]
            prev_close = hist["Close"].iloc[-2] if len(hist) > 1 else current_price

            change = current_price - prev_close
            change_percent = (change / prev_close) * 100 if prev_close else 0

            name = symbol
            try:
                info = ticker.info
                name = info.get("longName", info.get("shortName", symbol))
            except:
                pass

            quote = StockQuote(
                symbol=symbol,
                name=name,
                price=round(float(current_price), 2),
                change=round(float(change), 2),
                change_percent=round(float(change_percent), 2),
                market_cap=None,
            )

            self.quote_cache[symbol] = (quote, time.time())
            return quote

        except NotFound:
            raise
        except Exception as e:
            raise InternalServerError(f"Quote failed: {str(e)}")

    def get_batch_quotes(
        self, symbols: List[str]
    ) -> Tuple[List[StockQuote], List[str]]:
        from ..config.settings import MAX_BATCH_SIZE

        if len(symbols) > MAX_BATCH_SIZE:
            raise BadRequest(f"Max {MAX_BATCH_SIZE} symbols per request")

        quotes = []
        errors = []

        for symbol in symbols:
            try:
                quote = self.get_quote(symbol)
                quotes.append(quote)
            except Exception as e:
                errors.append(
                    f"{symbol}: {e.message if hasattr(e, 'message') else str(e)}"
                )

        return quotes, errors


stock_service = StockService()
