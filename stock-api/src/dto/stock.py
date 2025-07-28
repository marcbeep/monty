from pydantic import BaseModel
from typing import List, Optional


class StockSearch(BaseModel):
    symbol: str
    name: str
    type: str


class StockOverview(BaseModel):
    symbol: str
    name: str
    current_price: float
    previous_close: float
    change: float
    change_percent: float
    market_cap: Optional[float] = None
    volume: Optional[int] = None
    avg_volume: Optional[int] = None
    day_high: Optional[float] = None
    day_low: Optional[float] = None
    year_high: Optional[float] = None
    year_low: Optional[float] = None
    pe_ratio: Optional[float] = None
    dividend_yield: Optional[float] = None
    sector: Optional[str] = None
    industry: Optional[str] = None


class SearchResponse(BaseModel):
    success: bool
    data: List[StockSearch]


class OverviewResponse(BaseModel):
    success: bool
    data: StockOverview


class ErrorResponse(BaseModel):
    success: bool
    error: str
