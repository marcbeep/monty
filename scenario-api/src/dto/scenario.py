from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime


# Base response model
class BaseResponse(BaseModel):
    success: bool
    error: Optional[str] = None


# Chart data point
class ChartDataPoint(BaseModel):
    date: str
    value: float


# Drawdown data point
class DrawdownDataPoint(BaseModel):
    date: str
    drawdown: float
    peak: float
    value: float


# Portfolio metrics
class PortfolioMetrics(BaseModel):
    total_return: float
    annualized_return: float
    volatility: float
    sharpe_ratio: float
    max_drawdown: float
    calmar_ratio: float


# Portfolio model (simplified)
class Portfolio(BaseModel):
    id: int
    name: str
    # Add other fields as needed


# Scenario event
class ScenarioEvent(BaseModel):
    id: str
    name: str
    description: str
    start_date: str
    end_date: str
    market_conditions: str
    severity: Literal["Low", "Medium", "High", "Extreme"]


# Recovery info
class Recovery(BaseModel):
    time_to_recover: int
    max_drawdown: float
    recovery_date: str


# Stress test params
class StressTestParams(BaseModel):
    portfolio_id: int
    mode: Literal["historical", "scenario"]
    historical: Optional[Dict[str, str]] = None
    scenario: Optional[Dict[str, str]] = None
    # Optional holdings payload provided by hub for deterministic calculations
    holdings: Optional[List[Dict[str, Any]]] = None


# Stress test result
class StressTestResult(BaseModel):
    mode: Literal["historical", "scenario"]
    time_range: Dict[str, str]
    portfolio: Portfolio
    metrics: PortfolioMetrics
    chart_data: List[ChartDataPoint]
    drawdown_data: List[DrawdownDataPoint]
    recovery: Optional[Recovery] = None
    scenario: Optional[ScenarioEvent] = None


# Monte Carlo params
class MonteCarloParams(BaseModel):
    portfolio_id: int
    time_horizon: int
    simulations: int
    confidence_interval: int
    # Optional holdings payload provided by hub for deterministic calculations
    holdings: Optional[List[Dict[str, Any]]] = None


# Monte Carlo projections
class MonteCarloProjections(BaseModel):
    percentile5: List[ChartDataPoint]
    percentile25: List[ChartDataPoint]
    percentile50: List[ChartDataPoint]
    percentile75: List[ChartDataPoint]
    percentile95: List[ChartDataPoint]


# Monte Carlo outcomes
class MonteCarloOutcomes(BaseModel):
    best_case: float
    worst_case: float
    median: float
    probability_of_profit: float
    probability_of_doubling: float


# Distribution data
class DistributionData(BaseModel):
    final_values: List[float]
    return_distribution: List[Dict[str, float]]


# Monte Carlo result
class MonteCarloResult(BaseModel):
    portfolio: Portfolio
    params: MonteCarloParams
    projections: MonteCarloProjections
    outcomes: MonteCarloOutcomes
    distribution_data: DistributionData


# Response models
class StressTestResponse(BaseResponse):
    data: Optional[StressTestResult] = None


class MonteCarloResponse(BaseResponse):
    data: Optional[MonteCarloResult] = None
