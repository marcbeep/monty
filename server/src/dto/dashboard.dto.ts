import { z } from "zod";

// Request schemas
export const dashboardPortfolioSchema = z.object({
  id: z.string().min(1, "Portfolio ID is required"),
  timeframe: z.string().optional().default("YTD"),
});

export type DashboardPortfolioRequest = z.infer<
  typeof dashboardPortfolioSchema
>;

// Response types (matching frontend interfaces)
export interface ChartDataPoint {
  date: string;
  value: number;
  timestamp: number;
}

export interface AssetAllocation {
  type: string;
  percentage: number;
  color: string;
}

export interface DashboardPortfolio {
  id: number;
  name: string;
  type: "Conservative" | "Moderate" | "Aggressive";
  description: string;
  strategy: AssetAllocation[];
  riskLevel: "Low" | "Medium" | "High";
  lastUpdated: string;
}

export interface Allocation {
  id: number;
  symbol: string;
  name: string;
  type: string;
  allocationPercent: number;
  baseAmount: number;
  currentValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface PortfolioMetrics {
  baseAmount: number;
  currentValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  annualizedReturn: number;
  annualizedReturnPercent: number;
  volatility: number;
  sortinoRatio: number;
  maxDrawdown: number;
  dayChange: number;
  dayChangePercent: number;
  startDate: string;
  lastUpdated: string;
  timeframe: string;
  timeframeLabel: string; // e.g., "YTD Return", "1Y Return", "5Y Return"
  returnLabel: string; // e.g., "Return since Jan 1", "Return over 1 year"
  portfolioValueLabel: string; // e.g., "Portfolio value change over 5 years"
  volatilityLabel: string; // e.g., "5Y Volatility", "Price fluctuation over 5 years"
  sortinoLabel: string; // e.g., "5Y Sortino Ratio", "Downside risk-adjusted returns over 5 years"
  portfolioValueDescription: string; // e.g., "+$2,500 over 1 month"
  volatilityDescription: string; // e.g., "high price fluctuation over 1 month"
  sortinoDescription: string; // e.g., "Above 1.0, acceptable performance"
}

export interface DashboardData {
  portfolio: DashboardPortfolio;
  metrics: PortfolioMetrics;
  chartData: ChartDataPoint[];
  allocations: Allocation[];
  timeframe: string;
}

export interface PortfolioSummary {
  id: number;
  name: string;
  type: "Conservative" | "Moderate" | "Aggressive";
  riskLevel: "Low" | "Medium" | "High";
  currentValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  lastUpdated: string;
}
