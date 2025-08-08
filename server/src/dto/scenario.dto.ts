import { z } from "zod";

// Request schemas
export const stressTestSchema = z.object({
  portfolio_id: z
    .number()
    .int()
    .positive("Portfolio ID must be a positive integer"),
  mode: z.enum(["historical", "scenario"], {
    errorMap: () => ({ message: "Mode must be 'historical' or 'scenario'" }),
  }),
  historical: z
    .object({
      start_date: z.string().optional(),
      end_date: z.string().optional(),
    })
    .optional(),
  scenario: z
    .object({
      scenario_id: z.string().optional(),
    })
    .optional(),
  // Enriched by server from portfolio holdings
  holdings: z
    .array(
      z.object({
        symbol: z.string(),
        allocation: z.number(),
        type: z.string(),
        name: z.string(),
      })
    )
    .optional(),
});

export const monteCarloSchema = z.object({
  portfolio_id: z
    .number()
    .int()
    .positive("Portfolio ID must be a positive integer"),
  time_horizon: z
    .number()
    .int()
    .min(1)
    .max(120, "Time horizon must be between 1 and 120 months"),
  simulations: z
    .number()
    .int()
    .min(100)
    .max(10000, "Simulations must be between 100 and 10,000"),
  confidence_interval: z
    .number()
    .int()
    .min(50)
    .max(99, "Confidence interval must be between 50 and 99"),
  // Enriched by server from portfolio holdings
  holdings: z
    .array(
      z.object({
        symbol: z.string(),
        allocation: z.number(),
        type: z.string(),
        name: z.string(),
      })
    )
    .optional(),
});

export type StressTestRequest = z.infer<typeof stressTestSchema>;
export type MonteCarloRequest = z.infer<typeof monteCarloSchema>;

// Response types (matching scenario API data structures)
export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface DrawdownDataPoint {
  date: string;
  drawdown: number;
  peak: number;
  value: number;
}

export interface PortfolioMetrics {
  total_return: number;
  annualized_return: number;
  volatility: number;
  sharpe_ratio: number;
  max_drawdown: number;
  calmar_ratio: number;
}

export interface Portfolio {
  id: number;
  name: string;
}

export interface ScenarioEvent {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  market_conditions: string;
  severity: "Low" | "Medium" | "High" | "Extreme";
}

export interface Recovery {
  time_to_recover: number;
  max_drawdown: number;
  recovery_date: string;
}

export interface StressTestResult {
  mode: "historical" | "scenario";
  time_range: {
    start_date: string;
    end_date: string;
  };
  portfolio: Portfolio;
  metrics: PortfolioMetrics;
  chart_data: ChartDataPoint[];
  drawdown_data: DrawdownDataPoint[];
  recovery?: Recovery;
  scenario?: ScenarioEvent;
}

export interface MonteCarloProjections {
  percentile5: ChartDataPoint[];
  percentile25: ChartDataPoint[];
  percentile50: ChartDataPoint[];
  percentile75: ChartDataPoint[];
  percentile95: ChartDataPoint[];
}

export interface MonteCarloOutcomes {
  best_case: number;
  worst_case: number;
  median: number;
  probability_of_profit: number;
  probability_of_doubling: number;
}

export interface DistributionData {
  final_values: number[];
  return_distribution: Array<{
    return: number;
    probability: number;
  }>;
}

export interface MonteCarloResult {
  portfolio: Portfolio;
  params: {
    portfolio_id: number;
    time_horizon: number;
    simulations: number;
    confidence_interval: number;
  };
  projections: MonteCarloProjections;
  outcomes: MonteCarloOutcomes;
  distribution_data: DistributionData;
}
