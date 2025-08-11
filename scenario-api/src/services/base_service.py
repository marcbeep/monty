from ..config.settings import HUB_URL, API_PREFIX
import urllib.parse
import asyncio
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class BaseService:
    """Base service providing common functionality for scenario analysis."""

    def _infer_timeframe(self, start_date: str, end_date: str) -> str:
        """Map dates to a reasonable timeframe bucket used by hub/stock-api"""
        from datetime import datetime

        fmt = "%Y-%m-%d"
        try:
            d0 = datetime.strptime(start_date, fmt)
            d1 = datetime.strptime(end_date, fmt)
        except Exception:
            return "1Y"
        days = (d1 - d0).days
        if days <= 1:
            return "1D"
        if days <= 5:
            return "5D"
        if days <= 31:
            return "1M"
        if days <= 183:
            return "6M"
        if d0.year == d1.year:
            return "YTD"
        if days <= 365:
            return "1Y"
        if days <= 5 * 365:
            return "5Y"
        return "MAX"

    async def _fetch_histories(
        self, symbols: List[str], timeframe: str
    ) -> Dict[str, List[Dict[str, float]]]:
        """Fetch historical data for symbols from the hub stock endpoint."""
        print(
            f"🔥 _FETCH_HISTORIES: Called with symbols={symbols}, timeframe={timeframe}"
        )
        import aiohttp

        async def fetch_one(session: aiohttp.ClientSession, symbol: str):
            url = f"{HUB_URL}{API_PREFIX}/stocks/{urllib.parse.quote(symbol)}/history?period={urllib.parse.quote(timeframe.upper())}"
            print(f"🔥 FETCH_ONE: Fetching stock data for {symbol} from: {url}")
            logger.info(f"Fetching stock data for {symbol} from: {url}")
            try:
                async with session.get(url, timeout=10) as resp:
                    print(
                        f"🔥 FETCH_ONE: Got response for {symbol}: status={resp.status}"
                    )
                    resp.raise_for_status()
                    data = await resp.json()
                    print(
                        f"🔥 FETCH_ONE: JSON response for {symbol}: success={data.get('success')}"
                    )
                    print(
                        f"🔥 FETCH_ONE: Data type for {symbol}: {type(data.get('data'))}"
                    )
                    logger.info(
                        f"Stock API response for {symbol}: success={data.get('success')}, data_type={type(data.get('data'))}"
                    )
                    # hub responds { success, data: [ {date, close} ] } - data is directly the array
                    if not data.get("success"):
                        print(
                            f"🔥 FETCH_ONE: Stock API returned success=False for {symbol}"
                        )
                        logger.warning(f"Stock API returned success=False for {symbol}")
                        return symbol, []

                    # The server returns the data array directly, not nested in a data object
                    arr = data.get("data", [])
                    print(
                        f"🔥 FETCH_ONE: Stock data for {symbol}: {len(arr)} price points"
                    )
                    logger.info(
                        f"Stock data for {symbol}: {len(arr)} price points, sample: {arr[:3] if arr else 'None'}"
                    )
                    return symbol, arr
            except Exception as e:
                print(f"🔥 FETCH_ONE: Exception for {symbol}: {type(e).__name__}: {e}")
                logger.error(f"Exception fetching {symbol}: {type(e).__name__}: {e}")
                return symbol, []

        history_map: Dict[str, List[Dict[str, float]]] = {}
        async with aiohttp.ClientSession() as session:
            tasks = [fetch_one(session, s) for s in symbols]
            print(f"🔥 GATHER: Starting asyncio.gather for {len(tasks)} tasks")
            results = await asyncio.gather(*tasks, return_exceptions=True)
            print(f"🔥 GATHER: Got {len(results)} results")

        for i, res in enumerate(results):
            print(f"🔥 RESULTS: Processing result {i}: {type(res)}")
            if isinstance(res, Exception):
                print(f"🔥 RESULTS: Exception in result {i}: {res}")
                continue
            sym, arr = res
            print(f"🔥 RESULTS: Adding {sym} with {len(arr)} data points")
            history_map[sym] = arr

        print(
            f"🔥 FINAL: History map has {len(history_map)} entries: {list(history_map.keys())}"
        )
        return history_map
