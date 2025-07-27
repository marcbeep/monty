from fastapi import APIRouter, Path, Query
from app.schemas.common import SuccessResponse

router = APIRouter()


@router.get("/{portfolio_id}")
async def get_dashboard_data(
    portfolio_id: int = Path(..., description="Portfolio ID"),
    timeframe: str = Query("YTD", description="Timeframe for data"),
):
    """Get dashboard data for a portfolio"""
    # TODO: Implement dashboard data logic
    return SuccessResponse(
        data={
            "portfolio_id": portfolio_id,
            "timeframe": timeframe,
            "message": "Dashboard endpoint - not implemented yet",
        }
    )
