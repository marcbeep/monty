from fastapi import APIRouter
from ..services.stock_service import stock_service
from ..dto.stock import (
    SearchResponse,
    QuoteResponse,
    BatchQuoteResponse,
    BatchQuoteRequest,
)
from ..config.settings import DEFAULT_SEARCH_LIMIT

router = APIRouter()


@router.get("/search", response_model=SearchResponse)
async def search_stocks(q: str, limit: int = DEFAULT_SEARCH_LIMIT):
    stocks = stock_service.search_stocks(q, limit)
    return SearchResponse(success=True, data=stocks)


@router.get("/quote/{symbol}", response_model=QuoteResponse)
async def get_quote(symbol: str):
    quote = stock_service.get_quote(symbol)
    return QuoteResponse(success=True, data=quote)


@router.post("/quotes", response_model=BatchQuoteResponse)
async def get_batch_quotes(request: BatchQuoteRequest):
    quotes, errors = stock_service.get_batch_quotes(request.symbols)
    return BatchQuoteResponse(success=True, data=quotes, errors=errors)
