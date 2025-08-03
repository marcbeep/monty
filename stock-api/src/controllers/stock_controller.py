from fastapi import APIRouter
from ..services.stock_service import stock_service
from ..dto.stock import (
    SearchResponse,
    BasicResponse,
    OverviewResponse,
    HistoryResponse,
)
from ..config.settings import DEFAULT_SEARCH_LIMIT

router = APIRouter()


@router.get("/search", response_model=SearchResponse)
async def search_stocks(q: str, limit: int = DEFAULT_SEARCH_LIMIT):
    stocks = stock_service.search_stocks(q, limit)
    return SearchResponse(success=True, data=stocks)


@router.get("/basic/{symbol}", response_model=BasicResponse)
async def get_stock_basic(symbol: str):
    basic = stock_service.get_stock_basic(symbol)
    return BasicResponse(success=True, data=basic)


@router.get("/quote/{symbol}", response_model=OverviewResponse)
async def get_stock_overview(symbol: str):
    overview = stock_service.get_stock_overview(symbol)
    return OverviewResponse(success=True, data=overview)


@router.get("/history/{symbol}", response_model=HistoryResponse)
async def get_stock_history(symbol: str, timeframe: str = "1Y"):
    """
    Get historical stock data for the specified timeframe.

    Args:
        symbol: Stock symbol (e.g., "AAPL")
        timeframe: One of "1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "Max"
    """
    history = stock_service.get_stock_history(symbol, timeframe)
    return HistoryResponse(success=True, data=history)


@router.get("/availability/{symbol}")
async def get_data_availability(symbol: str):
    """
    Get information about data availability for different timeframes.
    Returns which timeframes have data and their oldest available dates.
    """
    availability = stock_service.get_data_availability_info(symbol)
    return {"success": True, "data": availability}
