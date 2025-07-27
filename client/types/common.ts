// Common types used across the application

export type AssetType = "Cash" | "Equities" | "Fixed Income" | "Alternatives";

export type RiskLevel = "Low" | "Medium" | "High";

export type PortfolioType = "Conservative" | "Moderate" | "Aggressive";

export interface ChartDataPoint {
  date: string;
  value: number; // Portfolio value on this date
  timestamp: number;
}

export interface AssetAllocation {
  type: AssetType;
  percentage: number;
  color: string; // Hex color for consistent theming
}
