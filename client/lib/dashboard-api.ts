import { api } from "./api";
import type { DashboardData, Portfolio } from "@/types";

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

export const dashboardApi = {
  getDashboardData: (
    portfolioId: number,
    timeframe: string = "YTD"
  ): Promise<DashboardData> =>
    api.get<DashboardData>(
      `/api/v1/dashboard/portfolio/${portfolioId}?timeframe=${timeframe}`
    ),

  getPortfolios: (): Promise<PortfolioSummary[]> =>
    api.get<PortfolioSummary[]>("/api/v1/dashboard/portfolios"),
};

// Transform PortfolioSummary to Portfolio for backward compatibility
export const transformSummaryToPortfolio = (
  summary: PortfolioSummary
): Portfolio => ({
  id: summary.id,
  name: summary.name,
  type: summary.type,
  description: `${summary.type} portfolio strategy`,
  strategy: [], // Will be populated by dashboard data
  riskLevel: summary.riskLevel,
  lastUpdated: summary.lastUpdated,
});
