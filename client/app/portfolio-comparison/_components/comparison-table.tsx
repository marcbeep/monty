"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";
import type { Portfolio } from "@/types";
import type { PortfolioMetrics } from "@/types/portfolio";

interface ComparisonTableProps {
  portfolio1?: Portfolio;
  portfolio2?: Portfolio;
  metrics1?: PortfolioMetrics;
  metrics2?: PortfolioMetrics;
  isLoading?: boolean;
}

export function ComparisonTable({
  portfolio1,
  portfolio2,
  metrics1,
  metrics2,
  isLoading = false,
}: ComparisonTableProps) {
  if (isLoading || !portfolio1 || !portfolio2 || !metrics1 || !metrics2) {
    return (
      <Card className="bg-surface-primary shadow-sm">
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>Key metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 py-3 border-b last:border-b-0"
              >
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const comparisonRows = [
    {
      label: "Portfolio Value",
      value1: `$${metrics1.currentValue.toLocaleString()}`,
      value2: `$${metrics2.currentValue.toLocaleString()}`,
      comparison: compareValues(metrics1.currentValue, metrics2.currentValue),
      type: "currency" as const,
    },
    {
      label: "Total Return",
      value1: `${metrics1.totalReturnPercent.toFixed(2)}%`,
      value2: `${metrics2.totalReturnPercent.toFixed(2)}%`,
      comparison: compareValues(
        metrics1.totalReturnPercent,
        metrics2.totalReturnPercent
      ),
      type: "percentage" as const,
    },
    {
      label: "Annualized Return",
      value1: `${metrics1.annualizedReturnPercent.toFixed(2)}%`,
      value2: `${metrics2.annualizedReturnPercent.toFixed(2)}%`,
      comparison: compareValues(
        metrics1.annualizedReturnPercent,
        metrics2.annualizedReturnPercent
      ),
      type: "percentage" as const,
    },
    {
      label: "Volatility",
      value1: `${metrics1.volatility.toFixed(2)}%`,
      value2: `${metrics2.volatility.toFixed(2)}%`,
      comparison: compareValues(metrics1.volatility, metrics2.volatility, true), // Lower is better for volatility
      type: "percentage" as const,
    },
  ];

  return (
    <Card className="bg-surface-primary shadow-sm">
      <CardHeader>
        <CardTitle>Performance Comparison</CardTitle>
        <CardDescription>Key metrics at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {/* Header Row */}
          <div className="grid grid-cols-3 gap-4 py-3 border-b font-medium text-sm text-muted-foreground">
            <div>Metric</div>
            <div className="text-center">{portfolio1.name}</div>
            <div className="text-center">{portfolio2.name}</div>
          </div>

          {/* Data Rows */}
          {comparisonRows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 py-3 border-b last:border-b-0"
            >
              <div className="font-medium">{row.label}</div>
              <div className="text-center flex items-center justify-center gap-1">
                <span className={row.type}>{row.value1}</span>
                {row.comparison === "portfolio1" && (
                  <ArrowUpIcon className="h-4 w-4 text-financial-positive" />
                )}
                {row.comparison === "portfolio2" && (
                  <ArrowDownIcon className="h-4 w-4 text-financial-negative" />
                )}
                {row.comparison === "equal" && (
                  <MinusIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="text-center flex items-center justify-center gap-1">
                <span className={row.type}>{row.value2}</span>
                {row.comparison === "portfolio2" && (
                  <ArrowUpIcon className="h-4 w-4 text-financial-positive" />
                )}
                {row.comparison === "portfolio1" && (
                  <ArrowDownIcon className="h-4 w-4 text-financial-negative" />
                )}
                {row.comparison === "equal" && (
                  <MinusIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to compare values and determine which is better
function compareValues(
  value1: number,
  value2: number,
  lowerIsBetter: boolean = false
): "portfolio1" | "portfolio2" | "equal" {
  const diff = Math.abs(value1 - value2);

  // If values are very close, consider them equal
  if (diff < 0.01) {
    return "equal";
  }

  if (lowerIsBetter) {
    return value1 < value2 ? "portfolio1" : "portfolio2";
  } else {
    return value1 > value2 ? "portfolio1" : "portfolio2";
  }
}
