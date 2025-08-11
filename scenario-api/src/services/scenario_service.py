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
        print(
            f"🔥 _FETCH_HISTORIES: Called with symbols={symbols}, timeframe={timeframe}"
        )
        import aiohttp

        async def fetch_one(session: aiohttp.ClientSession, symbol: str):
            url = f"{HUB_URL}{API_PREFIX}/stocks/{urllib.parse.quote(symbol)}/history?period={urllib.parse.quote(timeframe.upper())}"
            print(f"🔥 FETCH_ONE: Fetching stock data for {symbol} from: {url}")
            logger.info(f"Fetching stock data for {symbol} from: {url}")
            try:
                async with session.get(url, timeout=10) as resp:
                    print(
                        f"🔥 FETCH_ONE: Got response for {symbol}: status={resp.status}"
                    )
                    resp.raise_for_status()
                    data = await resp.json()
                    print(
                        f"🔥 FETCH_ONE: JSON response for {symbol}: success={data.get('success')}"
                    )
                    print(
                        f"🔥 FETCH_ONE: Data type for {symbol}: {type(data.get('data'))}"
                    )
                    logger.info(
                        f"Stock API response for {symbol}: success={data.get('success')}, data_type={type(data.get('data'))}"
                    )
                    # hub responds { success, data: [ {date, close} ] } - data is directly the array
                    if not data.get("success"):
                        print(
                            f"🔥 FETCH_ONE: Stock API returned success=False for {symbol}"
                        )
                        logger.warning(f"Stock API returned success=False for {symbol}")
                        return symbol, []

                    # The server returns the data array directly, not nested in a data object
                    arr = data.get("data", [])
                    print(
                        f"🔥 FETCH_ONE: Stock data for {symbol}: {len(arr)} price points"
                    )
                    logger.info(
                        f"Stock data for {symbol}: {len(arr)} price points, sample: {arr[:3] if arr else 'None'}"
                    )
                    return symbol, arr
            except Exception as e:
                print(f"🔥 FETCH_ONE: Exception for {symbol}: {type(e).__name__}: {e}")
                logger.error(f"Exception fetching {symbol}: {type(e).__name__}: {e}")
                return symbol, []

        history_map: Dict[str, List[Dict[str, float]]] = {}
        async with aiohttp.ClientSession() as session:
            tasks = [fetch_one(session, s) for s in symbols]
            print(f"🔥 GATHER: Starting asyncio.gather for {len(tasks)} tasks")
            results = await asyncio.gather(*tasks, return_exceptions=True)
            print(f"🔥 GATHER: Got {len(results)} results")

        for i, res in enumerate(results):
            print(f"🔥 RESULTS: Processing result {i}: {type(res)}")
            if isinstance(res, Exception):
                print(f"🔥 RESULTS: Exception in result {i}: {res}")
                continue
            sym, arr = res
            print(f"🔥 RESULTS: Adding {sym} with {len(arr)} data points")
            history_map[sym] = arr

        print(
            f"🔥 FINAL: History map has {len(history_map)} entries: {list(history_map.keys())}"
        )
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

    async def run_monte_carlo(self, params: MonteCarloParams) -> MonteCarloResult:
        """Run Monte Carlo simulation on portfolio"""
        print(
            f"🔥 SERVICE DEBUG: Running Monte Carlo for portfolio {params.portfolio_id}, {params.simulations} sims, {params.time_horizon}Y"
        )
        print(f"🔥 SERVICE DEBUG: Full params object: {params}")
        print(f"🔥 SERVICE DEBUG: Params model dump: {params.model_dump()}")

        logger.info(
            f"Running Monte Carlo for portfolio {params.portfolio_id}, {params.simulations} sims, {params.time_horizon}Y"
        )
        logger.info(f"Full params object: {params}")
        logger.info(f"Params model dump: {params.model_dump()}")

        # Validate inputs
        holdings = params.model_dump().get("holdings") or []
        print(f"🔥 HOLDINGS DEBUG: Holdings received: {len(holdings)} assets")
        print(f"🔥 HOLDINGS DEBUG: Raw holdings data: {holdings}")
        logger.info(f"Holdings received: {len(holdings)} assets")
        logger.info(f"Raw holdings data: {holdings}")
        if not holdings:
            raise BadRequest("Holdings are required for Monte Carlo simulation")

        # Fetch 2Y historical data for return/volatility calculation
        symbols = [h.get("symbol") for h in holdings if h.get("allocation", 0) > 0]
        print(f"🔥 SYMBOLS DEBUG: Extracted symbols from holdings: {symbols}")
        print(
            f"🔥 SYMBOLS DEBUG: Holdings with allocations > 0: {[(h.get('symbol'), h.get('allocation')) for h in holdings if h.get('allocation', 0) > 0]}"
        )

        logger.info(f"Extracted symbols from holdings: {symbols}")
        logger.info(
            f"Holdings with allocations > 0: {[(h.get('symbol'), h.get('allocation')) for h in holdings if h.get('allocation', 0) > 0]}"
        )
        logger.info(f"About to fetch market data for symbols: {symbols}")

        if not symbols:
            print(f"🔥 ERROR: No symbols to fetch! Holdings processing failed.")
            logger.error("No symbols to fetch! Holdings processing failed.")
            return

        print(f"🔥 FETCH DEBUG: Starting _fetch_histories call for symbols: {symbols}")
        history_map = await self._fetch_histories(symbols, "5Y")  # Use 5Y instead of 2Y
        print(
            f"🔥 FETCH DEBUG: _fetch_histories completed, got {len(history_map)} results"
        )
        print(f"🔥 FETCH DEBUG: History map keys: {list(history_map.keys())}")

        logger.info(f"Market data fetched for {len(history_map)} symbols")
        logger.info(f"History map keys: {list(history_map.keys())}")

        # Calculate returns and covariance matrix
        returns_data = self._calculate_asset_returns(history_map)
        logger.info(f"Calculated returns for {len(returns_data)} assets")

        # Run Monte Carlo simulation
        base_amount = 100000.0
        final_values = self._run_simulation(
            holdings, returns_data, params.simulations, params.time_horizon, base_amount
        )
        import numpy as np

        logger.info(
            f"Monte Carlo simulation complete: {len(final_values)} scenarios, median=${np.median(final_values):.2f}"
        )

        # Generate time series projections
        projections = self._generate_projections(
            holdings, returns_data, params.time_horizon, params.simulations, base_amount
        )

        # Calculate outcomes
        outcomes = self._calculate_outcomes(final_values, base_amount)

        # Generate distribution data
        distribution = self._generate_distribution(final_values)

        return MonteCarloResult(
            portfolio=Portfolio(id=params.portfolio_id, name="Portfolio"),
            params=params,
            projections=projections,
            outcomes=outcomes,
            distribution_data=distribution,
        )

    def _calculate_asset_returns(
        self, history_map: Dict[str, List[Dict[str, float]]]
    ) -> Dict[str, Dict]:
        """Calculate mean returns and volatility for each asset"""
        import numpy as np

        logger.info(
            f"Processing asset returns for {len(history_map)} symbols: {list(history_map.keys())}"
        )
        returns_data = {}
        for symbol, prices in history_map.items():
            logger.info(f"Processing {symbol}: {len(prices)} price points")
            if len(prices) < 2:
                logger.warning(
                    f"Skipping {symbol}: insufficient price data ({len(prices)} points)"
                )
                continue

            # Calculate daily returns
            logger.info(
                f"Sample prices for {symbol}: {prices[:3] if prices else 'None'}"
            )
            price_values = [p.get("close", 0) for p in prices if p.get("close")]
            logger.info(
                f"Extracted {len(price_values)} valid close prices for {symbol}"
            )
            if len(price_values) < 2:
                logger.warning(
                    f"Skipping {symbol}: insufficient valid close prices ({len(price_values)} valid)"
                )
                continue

            returns = np.diff(price_values) / price_values[:-1]
            mean_return = float(np.mean(returns)) * 252
            volatility = float(np.std(returns)) * np.sqrt(252)

            logger.info(
                f"Calculated returns for {symbol}: mean_return={mean_return:.4f}, volatility={volatility:.4f}"
            )

            returns_data[symbol] = {
                "mean_return": mean_return,  # Annualized
                "volatility": volatility,  # Annualized
                "returns": returns.tolist(),
            }

        logger.info(
            f"Returns calculation complete: {len(returns_data)} symbols processed successfully"
        )
        return returns_data

    def _run_simulation(
        self,
        holdings: List[Dict],
        returns_data: Dict,
        num_sims: int,
        time_horizon: int,
        base_amount: float,
    ) -> List[float]:
        """Run Monte Carlo simulation and return final portfolio values"""
        import numpy as np

        logger.info(
            f"Running simulation with {len(holdings)} holdings and {len(returns_data)} return datasets"
        )
        logger.info(
            f"Holdings details: {[(h.get('symbol'), h.get('allocation')) for h in holdings]}"
        )
        logger.info(f"Returns data available for: {list(returns_data.keys())}")

        # Portfolio weights
        weights = {}
        total_allocation = sum(h.get("allocation", 0) for h in holdings)
        logger.info(f"Total allocation: {total_allocation}")

        for h in holdings:
            symbol = h.get("symbol")
            allocation = h.get("allocation", 0)
            logger.info(f"Processing holding: {symbol} with allocation {allocation}")
            if symbol in returns_data:
                weight = allocation / max(total_allocation, 1)
                weights[symbol] = weight
                logger.info(f"Added weight for {symbol}: {weight}")
            else:
                logger.warning(f"No returns data found for {symbol}")

        logger.info(f"Final weights: {weights}")

        if not weights:
            logger.warning(
                f"No weights calculated - returning flat {base_amount}. Holdings: {[h.get('symbol') for h in holdings]}, Returns data keys: {list(returns_data.keys())}"
            )
            return [base_amount] * num_sims

        # Calculate portfolio expected return and volatility
        symbols = list(weights.keys())
        mean_returns = np.array([returns_data[s]["mean_return"] for s in symbols])
        volatilities = np.array([returns_data[s]["volatility"] for s in symbols])
        weight_array = np.array([weights[s] for s in symbols])

        # Portfolio metrics (simplified - no correlation matrix for now)
        portfolio_return = np.dot(weight_array, mean_returns)
        portfolio_vol = np.sqrt(np.dot(weight_array**2, volatilities**2))

        logger.info(
            f"Portfolio calc: return={portfolio_return:.4f}, vol={portfolio_vol:.4f}, weights={dict(zip(symbols, weight_array))}"
        )

        # Run simulations
        np.random.seed(42)  # For reproducible results
        final_values = []

        for _ in range(num_sims):
            # Generate random return for time horizon
            random_return = np.random.normal(
                portfolio_return * time_horizon, portfolio_vol * np.sqrt(time_horizon)
            )
            final_value = base_amount * (1 + random_return)
            final_values.append(max(final_value, 0))  # Prevent negative values

        return final_values

    def _generate_projections(
        self,
        holdings: List[Dict],
        returns_data: Dict,
        time_horizon: int,
        num_sims: int,
        base_amount: float,
    ) -> MonteCarloProjections:
        """Generate percentile projections over time"""
        import numpy as np
        from datetime import datetime, timedelta

        # Simplified: generate monthly projections
        months = min(time_horizon * 12, 60)  # Cap at 5 years of monthly data
        time_points = np.linspace(0, time_horizon, months)

        # Portfolio metrics (reuse calculation)
        weights = {}
        total_allocation = sum(h.get("allocation", 0) for h in holdings)
        for h in holdings:
            symbol = h.get("symbol")
            if symbol in returns_data:
                weights[symbol] = h.get("allocation", 0) / max(total_allocation, 1)

        if not weights:
            # Fallback to flat growth
            dates = [
                (datetime.now() + timedelta(days=30 * i)).strftime("%Y-%m-%d")
                for i in range(months)
            ]
            flat_values = [base_amount * (1 + 0.07 * t) for t in time_points]
            return MonteCarloProjections(
                percentile5=[
                    ChartDataPoint(date=d, value=v * 0.8)
                    for d, v in zip(dates, flat_values)
                ],
                percentile25=[
                    ChartDataPoint(date=d, value=v * 0.9)
                    for d, v in zip(dates, flat_values)
                ],
                percentile50=[
                    ChartDataPoint(date=d, value=v) for d, v in zip(dates, flat_values)
                ],
                percentile75=[
                    ChartDataPoint(date=d, value=v * 1.1)
                    for d, v in zip(dates, flat_values)
                ],
                percentile95=[
                    ChartDataPoint(date=d, value=v * 1.2)
                    for d, v in zip(dates, flat_values)
                ],
            )

        symbols = list(weights.keys())
        mean_returns = np.array([returns_data[s]["mean_return"] for s in symbols])
        volatilities = np.array([returns_data[s]["volatility"] for s in symbols])
        weight_array = np.array([weights[s] for s in symbols])

        portfolio_return = np.dot(weight_array, mean_returns)
        portfolio_vol = np.sqrt(np.dot(weight_array**2, volatilities**2))

        # Generate time series
        np.random.seed(42)
        projections_by_time = []

        for t in time_points:
            if t == 0:
                projections_by_time.append([base_amount] * num_sims)
                continue

            sim_values = []
            for _ in range(num_sims):
                random_return = np.random.normal(
                    portfolio_return * t, portfolio_vol * np.sqrt(t)
                )
                value = base_amount * (1 + random_return)
                sim_values.append(max(value, 0))
            projections_by_time.append(sim_values)

        # Calculate percentiles
        dates = [
            (datetime.now() + timedelta(days=30 * i)).strftime("%Y-%m-%d")
            for i in range(months)
        ]

        percentiles = {
            5: [np.percentile(values, 5) for values in projections_by_time],
            25: [np.percentile(values, 25) for values in projections_by_time],
            50: [np.percentile(values, 50) for values in projections_by_time],
            75: [np.percentile(values, 75) for values in projections_by_time],
            95: [np.percentile(values, 95) for values in projections_by_time],
        }

        return MonteCarloProjections(
            percentile5=[
                ChartDataPoint(date=d, value=round(v, 2))
                for d, v in zip(dates, percentiles[5])
            ],
            percentile25=[
                ChartDataPoint(date=d, value=round(v, 2))
                for d, v in zip(dates, percentiles[25])
            ],
            percentile50=[
                ChartDataPoint(date=d, value=round(v, 2))
                for d, v in zip(dates, percentiles[50])
            ],
            percentile75=[
                ChartDataPoint(date=d, value=round(v, 2))
                for d, v in zip(dates, percentiles[75])
            ],
            percentile95=[
                ChartDataPoint(date=d, value=round(v, 2))
                for d, v in zip(dates, percentiles[95])
            ],
        )

    def _calculate_outcomes(
        self, final_values: List[float], base_amount: float
    ) -> MonteCarloOutcomes:
        """Calculate outcome statistics"""
        import numpy as np

        final_array = np.array(final_values)
        profit_count = np.sum(final_array > base_amount)
        double_count = np.sum(final_array >= base_amount * 2)

        return MonteCarloOutcomes(
            best_case=round(float(np.percentile(final_array, 95)), 2),
            worst_case=round(float(np.percentile(final_array, 5)), 2),
            median=round(float(np.median(final_array)), 2),
            probability_of_profit=round(profit_count / len(final_values) * 100, 1),
            probability_of_doubling=round(double_count / len(final_values) * 100, 1),
        )

    def _generate_distribution(self, final_values: List[float]) -> DistributionData:
        """Generate return distribution for histogram"""
        import numpy as np

        # Create return buckets
        returns = [
            (v - 100000) / 100000 * 100 for v in final_values
        ]  # Percentage returns

        # Create histogram
        hist, bin_edges = np.histogram(returns, bins=10)
        probabilities = hist / len(returns) * 100

        return_distribution = []
        for i in range(len(hist)):
            bucket_center = (bin_edges[i] + bin_edges[i + 1]) / 2
            return_distribution.append(
                {
                    "return": round(bucket_center, 1),
                    "probability": round(float(probabilities[i]), 1),
                }
            )

        return DistributionData(
            final_values=[
                round(v, 2) for v in final_values[:100]
            ],  # Sample for display
            return_distribution=return_distribution,
        )


scenario_service = ScenarioService()
