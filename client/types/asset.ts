// Asset-related types

// Simplified security types for clean categorization
export type AssetType = "Cash" | "Equities" | "Fixed Income" | "Alternatives";

export interface Asset {
  symbol: string;
  name: string;
  type: AssetType;
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

// Structured asset allocation for visual representation
export interface AssetAllocation {
  type: AssetType;
  percentage: number;
  color: string; // Hex color for consistent theming
}
