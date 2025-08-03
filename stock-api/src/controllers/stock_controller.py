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
async def get_stock_history(symbol: str, period: str = "1y"):
    history = stock_service.get_stock_history(symbol, period)
    return HistoryResponse(success=True, data=history)
