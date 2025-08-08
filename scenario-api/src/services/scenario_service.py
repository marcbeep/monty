from ..dto.scenario import (
    StressTestParams,
    StressTestResult,
    MonteCarloParams,
    MonteCarloResult,
    Portfolio,
    PortfolioMetrics,
    ChartDataPoint,
    DrawdownDataPoint,
    MonteCarloProjections,
    MonteCarloOutcomes,
    DistributionData,
)
from ..utils.errors import BadRequest, NotFound
from ..config.settings import HUB_URL, API_PREFIX
import math
import json
import urllib.parse
import asyncio
from typing import Dict, List, Tuple, Any
import logging

logger = logging.getLogger(__name__)


class ScenarioService:

    async def run_stress_test(self, params: StressTestParams) -> StressTestResult:
        """Run stress test analysis on portfolio using hub for market data."""
        logger.info(
            f"Running stress test for portfolio {params.portfolio_id} mode={params.mode}"
        )

        if params.mode != "historical":
            raise BadRequest("Only historical mode is supported currently")

        if not params.historical:
            raise BadRequest("Historical date range is required")

        # Hub enriches payload with holdings; validate
        holdings = params.model_dump().get("holdings") or []
        if not holdings:
            raise BadRequest("Holdings are required to run stress test")

        start_date = params.historical.get("start_date")
        end_date = params.historical.get("end_date")
        if not start_date or not end_date:
            raise BadRequest("start_date and end_date are required")

        # Determine an appropriate server timeframe bucket from dates
        timeframe = self._infer_timeframe(start_date, end_date)

        # Fetch historical data for all symbols via hub stock endpoint in parallel
        symbols = [h.get("symbol") for h in holdings if h.get("allocation", 0) > 0]
        history_map = await self._fetch_histories(symbols, timeframe)

        # Compute combined portfolio series
        base_amount = 100000.0
        portfolio_series = self._compute_portfolio_series(
            holdings, history_map, base_amount
        )

        # Trim to requested date range if necessary
        filtered_series = [
            ChartDataPoint(date=p[0], value=p[1])
            for p in portfolio_series
            if start_date <= p[0] <= end_date
        ]
        if not filtered_series:
            # Fallback to single point base if no data
            filtered_series = [
                ChartDataPoint(date=start_date, value=base_amount),
                ChartDataPoint(date=end_date, value=base_amount),
            ]

        # Compute drawdown series and metrics
        drawdowns, max_drawdown = self._compute_drawdowns(filtered_series)
        total_return = (
            filtered_series[-1].value - filtered_series[0].value
        ) / filtered_series[0].value
        ann_return = self._annualize_return(total_return, start_date, end_date)
        volatility = self._compute_volatility(filtered_series)  # fraction
        sharpe = ann_return / volatility if volatility > 0 else 0.0
        calmar = ann_return / abs(max_drawdown / 100.0) if max_drawdown != 0 else 0.0

        metrics = PortfolioMetrics(
            total_return=round(total_return, 6),
            annualized_return=round(ann_return, 6),
            volatility=round(volatility, 6),
            sharpe_ratio=round(sharpe, 4),
            max_drawdown=round(max_drawdown, 4),
            calmar_ratio=round(calmar, 4),
        )

        result = StressTestResult(
            mode=params.mode,
            time_range={"start_date": start_date, "end_date": end_date},
            portfolio=Portfolio(id=params.portfolio_id, name="Portfolio"),
            metrics=metrics,
            chart_data=filtered_series,
            drawdown_data=drawdowns,
        )

        return result

    def _infer_timeframe(self, start_date: str, end_date: str) -> str:
        # Map dates to a reasonable timeframe bucket used by hub/stock-api
        from datetime import datetime

        fmt = "%Y-%m-%d"
        try:
            d0 = datetime.strptime(start_date, fmt)
            d1 = datetime.strptime(end_date, fmt)
        except Exception:
            return "1Y"
        days = (d1 - d0).days
        if days <= 1:
            return "1D"
        if days <= 5:
            return "5D"
        if days <= 31:
            return "1M"
        if days <= 183:
            return "6M"
        if d0.year == d1.year:
            return "YTD"
        if days <= 365:
            return "1Y"
        if days <= 5 * 365:
            return "5Y"
        return "MAX"

    async def _fetch_histories(
        self, symbols: List[str], timeframe: str
    ) -> Dict[str, List[Dict[str, float]]]:
        import aiohttp

        async def fetch_one(session: aiohttp.ClientSession, symbol: str):
            url = f"{HUB_URL}{API_PREFIX}/stocks/{urllib.parse.quote(symbol)}/history?period={urllib.parse.quote(timeframe.upper())}"
            async with session.get(url, timeout=10) as resp:
                resp.raise_for_status()
                data = await resp.json()
                # hub responds { success, data: { symbol, period, data: [ {date, close} ] } }
                if not data.get("success"):
                    return symbol, []
                arr = data.get("data", {}).get("data", [])
                return symbol, arr

        history_map: Dict[str, List[Dict[str, float]]] = {}
        async with aiohttp.ClientSession() as session:
            tasks = [fetch_one(session, s) for s in symbols]
            results = await asyncio.gather(*tasks, return_exceptions=True)
        for res in results:
            if isinstance(res, Exception):
                continue
            sym, arr = res
            history_map[sym] = arr
        return history_map

    def _compute_portfolio_series(
        self,
        holdings: List[Dict[str, Any]],
        history_map: Dict[str, List[Dict[str, float]]],
        base_amount: float,
    ) -> List[Tuple[str, float]]:
        # Build set of all dates
        all_dates = set()
        for sym, arr in history_map.items():
            for p in arr:
                d = p.get("date")
                if d:
                    all_dates.add(d)
        if not all_dates:
            return []
        sorted_dates = sorted(all_dates)

        # Precompute shares per asset using first available price
        shares_by_symbol: Dict[str, float] = {}
        for h in holdings:
            sym = h.get("symbol")
            alloc = float(h.get("allocation", 0)) / 100.0
            if alloc <= 0:
                continue
            series = history_map.get(sym, [])
            if not series:
                continue
            first_price = None
            for p in series:
                cp = p.get("close")
                if cp and cp > 0:
                    first_price = cp
                    break
            if not first_price:
                continue
            allocated_amount = base_amount * alloc
            shares_by_symbol[sym] = allocated_amount / first_price

        # Compute portfolio value per date
        out: List[Tuple[str, float]] = []
        for d in sorted_dates:
            total_value = 0.0
            for sym, shares in shares_by_symbol.items():
                series = history_map.get(sym, [])
                # find price at date d (exact match)
                price = None
                for p in series:
                    if p.get("date") == d:
                        price = p.get("close")
                        break
                if price:
                    total_value += shares * price
            if total_value > 0:
                out.append((d, round(total_value, 2)))
        return out

    def _compute_drawdowns(
        self, series: List[ChartDataPoint]
    ) -> Tuple[List[DrawdownDataPoint], float]:
        peak = series[0].value if series else 0.0
        max_dd = 0.0
        out: List[DrawdownDataPoint] = []
        for pt in series:
            if pt.value > peak:
                peak = pt.value
            drawdown = 0.0 if peak == 0 else (pt.value - peak) / peak * 100.0
            max_dd = min(max_dd, drawdown)
            out.append(
                DrawdownDataPoint(
                    date=pt.date,
                    drawdown=round(drawdown, 4),
                    peak=round(peak, 2),
                    value=pt.value,
                )
            )
        return out, max_dd

    def _annualize_return(
        self, total_return_frac: float, start_date: str, end_date: str
    ) -> float:
        from datetime import datetime

        fmt = "%Y-%m-%d"
        try:
            d0 = datetime.strptime(start_date, fmt)
            d1 = datetime.strptime(end_date, fmt)
        except Exception:
            return total_return_frac
        days = max((d1 - d0).days, 1)
        years = days / 365.0
        if years <= 0:
            return total_return_frac
        return math.pow(1 + total_return_frac, 1 / years) - 1

    def _compute_volatility(self, series: List[ChartDataPoint]) -> float:
        # Simple volatility estimate: std dev of daily returns (fraction) scaled by sqrt(N)
        if len(series) < 2:
            return 0.0
        rets: List[float] = []
        prev = series[0].value
        for pt in series[1:]:
            if prev > 0 and pt.value > 0:
                rets.append((pt.value - prev) / prev)
            prev = pt.value
        if not rets:
            return 0.0
        mean = sum(rets) / len(rets)
        var = sum((r - mean) ** 2 for r in rets) / len(rets)
        std = math.sqrt(var)
        # Scale by sqrt(N) to reflect overall period; leave as fraction
        return std * math.sqrt(len(rets))

    def run_monte_carlo(self, params: MonteCarloParams) -> MonteCarloResult:
        """Run Monte Carlo simulation on portfolio"""
        logger.info(
            f"Running Monte Carlo simulation for portfolio {params.portfolio_id}"
        )

        # TODO: Implement actual Monte Carlo simulation logic
        # For now, return placeholder data matching expected structure

        placeholder_portfolio = Portfolio(id=params.portfolio_id, name="Test Portfolio")

        # Generate placeholder time series data
        placeholder_projections = MonteCarloProjections(
            percentile5=[
                ChartDataPoint(date=f"2024-{i:02d}-01", value=90000 + i * 500)
                for i in range(1, 13)
            ],
            percentile25=[
                ChartDataPoint(date=f"2024-{i:02d}-01", value=95000 + i * 800)
                for i in range(1, 13)
            ],
            percentile50=[
                ChartDataPoint(date=f"2024-{i:02d}-01", value=100000 + i * 1000)
                for i in range(1, 13)
            ],
            percentile75=[
                ChartDataPoint(date=f"2024-{i:02d}-01", value=105000 + i * 1200)
                for i in range(1, 13)
            ],
            percentile95=[
                ChartDataPoint(date=f"2024-{i:02d}-01", value=110000 + i * 1500)
                for i in range(1, 13)
            ],
        )

        placeholder_outcomes = MonteCarloOutcomes(
            best_case=128500,
            worst_case=95500,
            median=112000,
            probability_of_profit=72.5,
            probability_of_doubling=8.3,
        )

        placeholder_distribution = DistributionData(
            final_values=[95500, 98000, 112000, 125000, 128500],
            return_distribution=[
                {"return": -10.0, "probability": 5.0},
                {"return": 0.0, "probability": 25.0},
                {"return": 12.0, "probability": 50.0},
                {"return": 25.0, "probability": 15.0},
                {"return": 35.0, "probability": 5.0},
            ],
        )

        return MonteCarloResult(
            portfolio=placeholder_portfolio,
            params=params,
            projections=placeholder_projections,
            outcomes=placeholder_outcomes,
            distribution_data=placeholder_distribution,
        )


scenario_service = ScenarioService()
