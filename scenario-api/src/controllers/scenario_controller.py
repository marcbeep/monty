from fastapi import APIRouter
from ..services.scenario_service import scenario_service
from ..dto.scenario import (
    StressTestParams,
    StressTestResponse,
    MonteCarloParams,
    MonteCarloResponse,
)

router = APIRouter()


@router.post("/stress-test", response_model=StressTestResponse)
async def run_stress_test(params: StressTestParams):
    """
    Run stress test analysis on a portfolio.

    Supports both historical period analysis and predefined scenario testing.
    """
    result = await scenario_service.run_stress_test(params)
    return StressTestResponse(success=True, data=result)


@router.post("/monte-carlo", response_model=MonteCarloResponse)
async def run_monte_carlo(params: MonteCarloParams):
    """
    Run Monte Carlo simulation on a portfolio.

    Generates probabilistic projections based on historical data and correlation patterns.
    """
    result = await scenario_service.run_monte_carlo(params)
    return MonteCarloResponse(success=True, data=result)


@router.get("/health")
async def health_check():
    """Health check endpoint with version info"""
    return {
        "success": True,
        "data": {
            "status": "healthy",
            "service": "scenario-api",
            "version": "v1",
            "api_prefix": "/api/v1",
        },
    }
