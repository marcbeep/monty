from fastapi import APIRouter, HTTPException
from ..services.scenario_service import scenario_service
from ..dto.scenario import (
    StressTestParams,
    StressTestResponse,
    MonteCarloParams,
    MonteCarloResponse,
)
from ..utils.errors import BadRequest

router = APIRouter()


@router.post("/stress-test", response_model=StressTestResponse)
async def run_stress_test(params: StressTestParams):
    """
    Run stress test analysis on a portfolio.

    Supports both historical period analysis and predefined scenario testing.
    """
    try:
        result = scenario_service.run_stress_test(params)
        return StressTestResponse(success=True, data=result)
    except BadRequest as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/monte-carlo", response_model=MonteCarloResponse)
async def run_monte_carlo(params: MonteCarloParams):
    """
    Run Monte Carlo simulation on a portfolio.

    Generates probabilistic projections based on historical data and correlation patterns.
    """
    try:
        result = scenario_service.run_monte_carlo(params)
        return MonteCarloResponse(success=True, data=result)
    except BadRequest as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"success": True, "data": {"status": "healthy", "service": "scenario-api"}}
