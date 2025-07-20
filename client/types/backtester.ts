// Backtester-related types
import type { Portfolio, PortfolioMetrics } from "./portfolio";
import type { ChartDataPoint } from "./api";

// Historical Backtesting Types
export interface BacktestData {
  portfolio: Portfolio;
  startDate: string;
  endDate: string;
  metrics: PortfolioMetrics;
  chartData: ChartDataPoint[];
  drawdownData: DrawdownDataPoint[];
}

export interface DrawdownDataPoint {
  date: string;
  drawdown: number; // Percentage drawdown from peak
  peak: number; // Portfolio value at peak
  value: number; // Current portfolio value
}

export interface BacktestParams {
  portfolioId: number;
  startDate: string;
  endDate: string;
}

// Scenario Analysis Types
export interface ScenarioEvent {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  marketConditions: string;
  severity: "Low" | "Medium" | "High" | "Extreme";
}

export interface ScenarioResult {
  scenario: ScenarioEvent;
  portfolio: Portfolio;
  beforeMetrics: PortfolioMetrics;
  duringMetrics: PortfolioMetrics;
  afterMetrics: PortfolioMetrics;
  chartData: ChartDataPoint[];
  recovery: {
    timeToRecover: number; // Days to recover to pre-crisis level
    maxDrawdown: number; // Maximum drawdown during crisis
    recoveryDate: string;
  };
}

// Monte Carlo Simulation Types
export interface MonteCarloParams {
  portfolioId: number;
  timeHorizon: number; // Years
  simulations: number; // Number of simulation runs
  confidenceInterval: number; // e.g., 95 for 95% confidence
}

export interface MonteCarloResult {
  portfolio: Portfolio;
  params: MonteCarloParams;
  projections: {
    percentile5: ChartDataPoint[];
    percentile25: ChartDataPoint[];
    percentile50: ChartDataPoint[]; // Median
    percentile75: ChartDataPoint[];
    percentile95: ChartDataPoint[];
  };
  outcomes: {
    bestCase: number; // 95th percentile final value
    worstCase: number; // 5th percentile final value
    median: number; // 50th percentile final value
    probabilityOfProfit: number; // Percentage chance of positive returns
    probabilityOfDoubling: number; // Percentage chance of doubling investment
  };
  distributionData: {
    finalValues: number[]; // All simulation final values for histogram
    returnDistribution: { return: number; probability: number }[];
  };
}

// General Backtesting Types
export interface BacktesterState {
  selectedPortfolioId: number | null;
  historicalData: BacktestData | null;
  scenarioResults: ScenarioResult[];
  monteCarloResult: MonteCarloResult | null;
  isLoading: boolean;
  activeTab: "historical" | "scenarios" | "montecarlo";
}
