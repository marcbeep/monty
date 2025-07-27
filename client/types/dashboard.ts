import { Portfolio, PortfolioMetrics, Allocation } from "./portfolio";
import { ChartDataPoint } from "./common";

export interface DashboardData {
  portfolio: Portfolio;
  metrics: PortfolioMetrics;
  chartData: ChartDataPoint[];
  allocations: Allocation[];
  timeframe: string;
}
