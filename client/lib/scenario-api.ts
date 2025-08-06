import { api } from "./api";
import type {
  StressTestParams,
  StressTestResult,
  MonteCarloParams,
  MonteCarloResult,
} from "@/types/backtester";

// Server response types (snake_case from server/scenario-api)
interface ServerPortfolioMetrics {
  total_return: number;
  annualized_return: number;
  volatility: number;
  sharpe_ratio: number;
  max_drawdown: number;
  calmar_ratio: number;
}

interface ServerPortfolio {
  id: number;
  name: string;
}

interface ServerChartDataPoint {
  date: string;
  value: number;
}

interface ServerDrawdownDataPoint {
  date: string;
  drawdown: number;
  peak: number;
  value: number;
}

interface ServerRecovery {
  time_to_recover: number;
  max_drawdown: number;
  recovery_date: string;
}

interface ServerScenarioEvent {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  market_conditions: string;
  severity: "Low" | "Medium" | "High" | "Extreme";
}

interface ServerStressTestResult {
  mode: "historical" | "scenario";
  time_range: {
    start_date: string;
    end_date: string;
  };
  portfolio: ServerPortfolio;
  metrics: ServerPortfolioMetrics;
  chart_data: ServerChartDataPoint[];
  drawdown_data: ServerDrawdownDataPoint[];
  recovery?: ServerRecovery;
  scenario?: ServerScenarioEvent;
}

interface ServerMonteCarloProjections {
  percentile5: ServerChartDataPoint[];
  percentile25: ServerChartDataPoint[];
  percentile50: ServerChartDataPoint[];
  percentile75: ServerChartDataPoint[];
  percentile95: ServerChartDataPoint[];
}

interface ServerMonteCarloOutcomes {
  best_case: number;
  worst_case: number;
  median: number;
  probability_of_profit: number;
  probability_of_doubling: number;
}

interface ServerDistributionData {
  final_values: number[];
  return_distribution: Array<{
    return: number;
    probability: number;
  }>;
}

interface ServerMonteCarloResult {
  portfolio: ServerPortfolio;
  params: {
    portfolio_id: number;
    time_horizon: number;
    simulations: number;
    confidence_interval: number;
  };
  projections: ServerMonteCarloProjections;
  outcomes: ServerMonteCarloOutcomes;
  distribution_data: ServerDistributionData;
}

// Transform camelCase client params to snake_case server params
const transformStressTestParams = (params: StressTestParams) => {
  return {
    portfolio_id: params.portfolioId,
    mode: "historical" as const,
    historical: {
      start_date: params.historical.startDate,
      end_date: params.historical.endDate,
    },
  };
};

const transformMonteCarloParams = (params: MonteCarloParams) => {
  return {
    portfolio_id: params.portfolioId,
    time_horizon: params.timeHorizon,
    simulations: params.simulations,
    confidence_interval: params.confidenceInterval,
  };
};

// Transform snake_case server response to camelCase client response
const transformStressTestResult = (
  result: ServerStressTestResult
): StressTestResult => {
  // Transform server metrics to client PortfolioMetrics format
  // Note: We'll need to populate missing fields with reasonable defaults
  const clientMetrics = {
    baseAmount: 0, // Not provided by scenario API
    currentValue: 0, // Not provided by scenario API
    totalReturn: result.metrics.total_return,
    totalReturnPercent: result.metrics.total_return * 100,
    annualizedReturn: result.metrics.annualized_return,
    annualizedReturnPercent: result.metrics.annualized_return * 100,
    volatility: result.metrics.volatility,
    sortinoRatio: 0, // Not provided by scenario API (using sharpe_ratio instead)
    maxDrawdown: result.metrics.max_drawdown,
    dayChange: 0, // Not applicable for backtesting
    dayChangePercent: 0, // Not applicable for backtesting
    startDate: result.time_range.start_date,
    lastUpdated: new Date().toISOString(),
    timeframe: "Custom", // Backtesting uses custom timeframes
    timeframeLabel: "Stress Test Period",
    returnLabel: `Return from ${result.time_range.start_date} to ${result.time_range.end_date}`,
    portfolioValueLabel: "Portfolio value change during stress test",
    volatilityLabel: "Volatility during stress test period",
    sortinoLabel: "Risk-adjusted returns (using Sharpe ratio)",
    portfolioValueDescription: `${result.metrics.total_return >= 0 ? "+" : ""}${(result.metrics.total_return * 100).toFixed(2)}% during stress test`,
    volatilityDescription: `${result.metrics.volatility > 0.2 ? "high" : result.metrics.volatility > 0.1 ? "moderate" : "low"} price fluctuation`,
    sortinoDescription: `Sharpe ratio: ${result.metrics.sharpe_ratio.toFixed(2)} ${result.metrics.sharpe_ratio > 1.0 ? "(good)" : "(below average)"}`,
  };

  return {
    mode: "historical" as const,
    timeRange: {
      startDate: result.time_range.start_date,
      endDate: result.time_range.end_date,
    },
    portfolio: {
      id: result.portfolio.id,
      name: result.portfolio.name,
      type: "Moderate" as const, // Default for stress test
      description: "Portfolio under stress test analysis",
      strategy: [], // Not provided by scenario API
      riskLevel: "Medium" as const, // Default for stress test
      lastUpdated: new Date().toISOString(),
    },
    metrics: clientMetrics,
    chartData: result.chart_data.map((point) => ({
      date: point.date,
      value: point.value,
      timestamp: new Date(point.date).getTime(),
    })),
    drawdownData: result.drawdown_data.map((point) => ({
      date: point.date,
      drawdown: point.drawdown,
      peak: point.peak,
      value: point.value,
    })),
    ...(result.recovery && {
      recovery: {
        timeToRecover: result.recovery.time_to_recover,
        maxDrawdown: result.recovery.max_drawdown,
        recoveryDate: result.recovery.recovery_date,
      },
    }),
  };
};

const transformMonteCarloResult = (
  result: ServerMonteCarloResult
): MonteCarloResult => {
  return {
    portfolio: {
      id: result.portfolio.id,
      name: result.portfolio.name,
      type: "Moderate" as const, // Default for Monte Carlo
      description: "Portfolio under Monte Carlo simulation",
      strategy: [], // Not provided by scenario API
      riskLevel: "Medium" as const, // Default for Monte Carlo
      lastUpdated: new Date().toISOString(),
    },
    params: {
      portfolioId: result.params.portfolio_id,
      timeHorizon: result.params.time_horizon,
      simulations: result.params.simulations,
      confidenceInterval: result.params.confidence_interval,
    },
    projections: {
      percentile5: result.projections.percentile5.map((point) => ({
        ...point,
        timestamp: new Date(point.date).getTime(),
      })),
      percentile25: result.projections.percentile25.map((point) => ({
        ...point,
        timestamp: new Date(point.date).getTime(),
      })),
      percentile50: result.projections.percentile50.map((point) => ({
        ...point,
        timestamp: new Date(point.date).getTime(),
      })),
      percentile75: result.projections.percentile75.map((point) => ({
        ...point,
        timestamp: new Date(point.date).getTime(),
      })),
      percentile95: result.projections.percentile95.map((point) => ({
        ...point,
        timestamp: new Date(point.date).getTime(),
      })),
    },
    outcomes: {
      bestCase: result.outcomes.best_case,
      worstCase: result.outcomes.worst_case,
      median: result.outcomes.median,
      probabilityOfProfit: result.outcomes.probability_of_profit,
      probabilityOfDoubling: result.outcomes.probability_of_doubling,
    },
    distributionData: {
      finalValues: result.distribution_data.final_values,
      returnDistribution: result.distribution_data.return_distribution.map(
        (item) => ({
          return: item.return,
          probability: item.probability,
        })
      ),
    },
  };
};

export const scenarioApi = {
  /**
   * Run stress test analysis on a portfolio
   * Supports both historical period analysis and predefined scenario testing
   */
  runStressTest: async (
    params: StressTestParams
  ): Promise<StressTestResult> => {
    const serverParams = transformStressTestParams(params);
    const serverResult = await api.post<ServerStressTestResult>(
      "/api/v1/scenarios/stress-test",
      serverParams
    );
    return transformStressTestResult(serverResult);
  },

  /**
   * Run Monte Carlo simulation on a portfolio
   * Generates probabilistic projections based on historical data and correlation patterns
   */
  runMonteCarlo: async (
    params: MonteCarloParams
  ): Promise<MonteCarloResult> => {
    const serverParams = transformMonteCarloParams(params);
    const serverResult = await api.post<ServerMonteCarloResult>(
      "/api/v1/scenarios/monte-carlo",
      serverParams
    );
    return transformMonteCarloResult(serverResult);
  },
};
