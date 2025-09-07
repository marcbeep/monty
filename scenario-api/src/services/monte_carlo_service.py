from ..dto.scenario import (
    MonteCarloParams,
    MonteCarloResult,
    Portfolio,
    ChartDataPoint,
    MonteCarloProjections,
    MonteCarloOutcomes,
    DistributionData,
)
from ..utils.errors import BadRequest
from .base_service import BaseService
from ..config.settings import BASE_PORTFOLIO_AMOUNT
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class MonteCarloService(BaseService):
    """Service for running Monte Carlo simulations on portfolios."""

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

        # Fetch 5Y historical data for return/volatility calculation
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
        base_amount = BASE_PORTFOLIO_AMOUNT
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
            (v - BASE_PORTFOLIO_AMOUNT) / BASE_PORTFOLIO_AMOUNT * 100
            for v in final_values
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


# Service instance
monte_carlo_service = MonteCarloService()
