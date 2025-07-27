from fastapi import APIRouter, Path, Query
from app.schemas.common import SuccessResponse

router = APIRouter()


@router.get("/{portfolio1_id}/{portfolio2_id}")
async def compare_portfolios(
    portfolio1_id: int = Path(..., description="First portfolio ID"),
    portfolio2_id: int = Path(..., description="Second portfolio ID"),
    timeframe: str = Query("YTD", description="Timeframe for comparison"),
):
    """Compare two portfolios"""
    # TODO: Implement portfolio comparison logic
    return SuccessResponse(
        data={
            "portfolio1_id": portfolio1_id,
            "portfolio2_id": portfolio2_id,
            "timeframe": timeframe,
            "message": "Portfolio comparison endpoint - not implemented yet",
        }
    )
