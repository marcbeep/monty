from pydantic import BaseModel
from typing import List, Optional


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


class BatchQuoteRequest(BaseModel):
    symbols: List[str]


class SearchResponse(BaseModel):
    success: bool
    data: List[StockSearch]


class QuoteResponse(BaseModel):
    success: bool
    data: StockQuote


class BatchQuoteResponse(BaseModel):
    success: bool
    data: List[StockQuote]
    errors: List[str]


class ErrorResponse(BaseModel):
    success: bool
    error: str
