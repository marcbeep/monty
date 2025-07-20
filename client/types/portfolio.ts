// Portfolio-related types
import type { AssetType, AssetAllocation } from "./asset";

export interface Portfolio {
  id: number;
  name: string;
  type: "Conservative" | "Moderate" | "Aggressive";
  description: string;
  strategy: AssetAllocation[];
  riskLevel: "Low" | "Medium" | "High";
  lastUpdated: string;
}

export interface ExistingPortfolio {
  id: number;
  name: string;
}

export interface PortfolioAsset {
  symbol: string;
  name: string;
  type: AssetType;
  allocation: number;
}

export interface PortfolioMetrics {
  baseAmount: number; // Always $10,000
  currentValue: number; // Current total portfolio value
  totalReturn: number; // Total gain/loss in dollars
  totalReturnPercent: number; // Total return percentage
  annualizedReturn: number; // Annualized return in dollars
  annualizedReturnPercent: number; // Annualized return percentage - better for backtesting
  volatility: number; // Portfolio volatility (annualized standard deviation %)
  sortinoRatio: number; // Downside risk-adjusted return ratio - better than Sharpe
  maxDrawdown: number; // Maximum peak-to-trough decline percentage
  dayChange: number; // Today's change in dollars
  dayChangePercent: number; // Today's change percentage
  startDate: string; // Portfolio simulation start date
  lastUpdated: string;
}
