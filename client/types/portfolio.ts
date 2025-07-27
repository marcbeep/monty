import { AssetType, RiskLevel, PortfolioType, AssetAllocation } from "./common";

// Portfolio Builder Types
export interface Asset {
  symbol: string;
  name: string;
  type: AssetType;
}

export interface PortfolioAsset extends Asset {
  allocation: number;
}

export interface ExistingPortfolio {
  id: number;
  name: string;
}

// Portfolio Data Types
export interface Portfolio {
  id: number;
  name: string;
  type: PortfolioType;
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
  allocationPercent: number; // e.g., 60 for 60%
  baseAmount: number; // Dollar amount allocated from $10K base
  currentValue: number; // Current dollar value of this allocation
  totalReturn: number; // Total return in dollars since start
  totalReturnPercent: number; // Total return percentage since start
  dayChange: number; // Change in dollars today
  dayChangePercent: number; // Change percentage today
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
