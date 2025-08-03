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
