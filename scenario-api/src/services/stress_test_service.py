from ..dto.scenario import (
    StressTestParams,
    StressTestResult,
    Portfolio,
    PortfolioMetrics,
    ChartDataPoint,
    DrawdownDataPoint,
)
from ..utils.errors import BadRequest
from .base_service import BaseService
import math
from typing import Dict, List, Tuple, Any
import logging

logger = logging.getLogger(__name__)


class StressTestService(BaseService):
    """Service for running stress test analysis on portfolios."""

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

    def _compute_portfolio_series(
        self,
        holdings: List[Dict[str, Any]],
        history_map: Dict[str, List[Dict[str, float]]],
        base_amount: float,
    ) -> List[Tuple[str, float]]:
        """Compute portfolio value series from holdings and historical data."""
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
        """Compute drawdown series and maximum drawdown."""
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
        """Convert total return to annualized return."""
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
        """Calculate portfolio volatility from price series."""
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


# Service instance
stress_test_service = StressTestService()
