// UI and component-related types
import type { LucideIcon } from "lucide-react";

// Badge related types
export interface BadgeConfig {
  label: string;
  variant: "outline";
  className: string;
  icon: LucideIcon;
}

// Performance badge types
export type PerformanceBadgeType = "excellent" | "good" | "fair" | "poor";

// Risk badge types
export type RiskBadgeType = "low-risk" | "medium-risk" | "high-risk";

// Generic status badge types
export type StatusBadgeType = "positive" | "negative" | "neutral";

// Component prop interfaces
export interface Metrics {
  currentValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  annualizedReturnPercent: number;
  volatility: number;
  sortinoRatio: number;
}
