// API and data-related types
import type { Portfolio, PortfolioMetrics } from "./portfolio";
import type { Allocation } from "./asset";

export interface ChartDataPoint {
  date: string;
  value: number; // Portfolio value on this date
  timestamp: number;
}

export interface DashboardData {
  portfolio: Portfolio;
  metrics: PortfolioMetrics;
  chartData: ChartDataPoint[];
  allocations: Allocation[]; // Changed from holdings to allocations
  timeframe: string;
}
