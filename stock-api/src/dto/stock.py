from pydantic import BaseModel
from typing import List, Optional


class StockSearch(BaseModel):
    symbol: str
    name: str


class StockBasic(BaseModel):
    symbol: str
    name: str
    current_price: Optional[float] = None
    sector: Optional[str] = None


# Legacy model for backward compatibility
class StockOverview(BaseModel):
    symbol: str
    name: str
    current_price: float
    sector: Optional[str] = None


class SearchResponse(BaseModel):
    success: bool
    data: List[StockSearch]


class BasicResponse(BaseModel):
    success: bool
    data: StockBasic


class OverviewResponse(BaseModel):
    success: bool
    data: StockOverview


class ErrorResponse(BaseModel):
    success: bool
    error: str
