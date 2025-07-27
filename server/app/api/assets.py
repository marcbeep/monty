from fastapi import APIRouter, Query
from app.schemas.common import SuccessResponse

router = APIRouter()


@router.get("/")
async def get_assets():
    """Get all available assets"""
    # TODO: Implement assets listing logic
    return SuccessResponse(
        data={"message": "Assets list endpoint - not implemented yet"}
    )


@router.get("/search")
async def search_assets(q: str = Query(..., description="Search query")):
    """Search assets by query"""
    # TODO: Implement asset search logic
    return SuccessResponse(
        data={"message": f"Asset search endpoint for '{q}' - not implemented yet"}
    )
