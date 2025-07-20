import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Shield,
  AlertTriangle,
  CheckCircle,
  MinusCircle,
} from "lucide-react";

// Import badge types from centralized location
import type {
  BadgeConfig,
  PerformanceBadgeType,
  RiskBadgeType,
  StatusBadgeType,
} from "@/types";

// Centralized badge configurations
const PERFORMANCE_BADGES: Record<PerformanceBadgeType, BadgeConfig> = {
  excellent: {
    label: "Excellent",
    variant: "outline",
    className: "text-financial-positive border-financial-positive",
    icon: TrendingUp,
  },
  good: {
    label: "Good",
    variant: "outline",
    className: "text-financial-positive border-financial-positive",
    icon: CheckCircle,
  },
  fair: {
    label: "Fair",
    variant: "outline",
    className: "text-financial-neutral border-financial-neutral",
    icon: MinusCircle,
  },
  poor: {
    label: "Poor",
    variant: "outline",
    className: "text-financial-negative border-financial-negative",
    icon: TrendingDown,
  },
};

const RISK_BADGES: Record<RiskBadgeType, BadgeConfig> = {
  "low-risk": {
    label: "Low Risk",
    variant: "outline",
    className: "text-financial-positive border-financial-positive",
    icon: Shield,
  },
  "medium-risk": {
    label: "Medium Risk",
    variant: "outline",
    className: "text-financial-neutral border-financial-neutral",
    icon: BarChart3,
  },
  "high-risk": {
    label: "High Risk",
    variant: "outline",
    className: "text-financial-negative border-financial-negative",
    icon: AlertTriangle,
  },
};

const STATUS_BADGES: Record<StatusBadgeType, BadgeConfig> = {
  positive: {
    label: "Positive",
    variant: "outline",
    className: "text-financial-positive border-financial-positive",
    icon: TrendingUp,
  },
  negative: {
    label: "Negative",
    variant: "outline",
    className: "text-financial-negative border-financial-negative",
    icon: TrendingDown,
  },
  neutral: {
    label: "Neutral",
    variant: "outline",
    className: "text-financial-neutral border-financial-neutral",
    icon: Target,
  },
};

// Helper functions to get badge configurations
export function getPerformanceBadge(
  value: number,
  type: "return" | "volatility" | "ratio" | "drawdown"
): BadgeConfig {
  switch (type) {
    case "return":
      if (value >= 15) return PERFORMANCE_BADGES.excellent;
      if (value >= 8) return PERFORMANCE_BADGES.good;
      if (value >= 0) return PERFORMANCE_BADGES.fair;
      return PERFORMANCE_BADGES.poor;

    case "volatility":
      if (value <= 8) return RISK_BADGES["low-risk"];
      if (value <= 15) return RISK_BADGES["medium-risk"];
      return RISK_BADGES["high-risk"];

    case "ratio":
      if (value >= 1.5) return PERFORMANCE_BADGES.excellent;
      if (value >= 1.0) return PERFORMANCE_BADGES.good;
      if (value >= 0.5) return PERFORMANCE_BADGES.fair;
      return PERFORMANCE_BADGES.poor;

    case "drawdown":
      if (value >= -5) return RISK_BADGES["low-risk"];
      if (value >= -15) return RISK_BADGES["medium-risk"];
      return RISK_BADGES["high-risk"];
  }
}

export function getRiskBadge(riskLevel: string): BadgeConfig {
  switch (riskLevel.toLowerCase()) {
    case "low":
      return RISK_BADGES["low-risk"];
    case "medium":
      return RISK_BADGES["medium-risk"];
    case "high":
      return RISK_BADGES["high-risk"];
    default:
      return RISK_BADGES["medium-risk"];
  }
}

export function getStatusBadge(type: StatusBadgeType): BadgeConfig {
  return STATUS_BADGES[type];
}

// Helper to get return status badge based on value
export function getReturnBadge(value: number): BadgeConfig {
  if (value > 0) return STATUS_BADGES.positive;
  if (value < 0) return STATUS_BADGES.negative;
  return STATUS_BADGES.neutral;
}
