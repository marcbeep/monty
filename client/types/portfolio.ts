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
}
