import { AssetType, RiskLevel, AssetAllocation } from "./common";

// Portfolio Builder Types (aligned with server)
export interface Asset {
  symbol: string;
  name: string;
  type: AssetType;
}

export interface PortfolioAsset extends Asset {
  allocation: number;
}

// Server API Types
export interface CreatePortfolioRequest {
  name: string;
  description?: string;
  riskLevel: RiskLevel;
  assets: {
    symbol: string;
    name: string;
    type: AssetType;
    allocation: number;
  }[];
}

export interface UpdatePortfolioRequest extends CreatePortfolioRequest {
  id: string;
}

export interface PortfolioResponse {
  id: string;
  name: string;
  description: string | null;
  riskLevel: RiskLevel;
  assets: {
    symbol: string;
    name: string;
    type: AssetType;
    allocation: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Legacy types for backward compatibility with dashboard/other components
export interface Portfolio {
  id: number;
  name: string;
  type: "Conservative" | "Moderate" | "Aggressive";
  description: string;
  strategy: AssetAllocation[];
  riskLevel: RiskLevel;
  lastUpdated: string;
}

export interface Allocation {
  id: number;
  symbol: string;
  name: string;
  type: AssetType;
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
