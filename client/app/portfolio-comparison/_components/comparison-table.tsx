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
import { cn } from "@/lib/utils";
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

  // Helper function to get color class for values
  const getValueColorClass = (value: number, isReturn: boolean = false) => {
    if (isReturn) {
      return value >= 0 ? "text-financial-positive" : "text-financial-negative";
    }
    return ""; // No color for non-return values
  };

  const comparisonRows = [
    {
      label: "Portfolio Value",
      value1: `$${metrics1.currentValue.toLocaleString()}`,
      value2: `$${metrics2.currentValue.toLocaleString()}`,
      colorClass1: getValueColorClass(metrics1.totalReturnPercent, true),
      colorClass2: getValueColorClass(metrics2.totalReturnPercent, true),
      type: "currency" as const,
    },
    {
      label: "Value Change",
      value1: `${metrics1.totalReturn >= 0 ? "+" : ""}$${metrics1.totalReturn.toLocaleString()}`,
      value2: `${metrics2.totalReturn >= 0 ? "+" : ""}$${metrics2.totalReturn.toLocaleString()}`,
      colorClass1: getValueColorClass(metrics1.totalReturn, true),
      colorClass2: getValueColorClass(metrics2.totalReturn, true),
      type: "currency" as const,
    },
    {
      label: metrics1.timeframeLabel || "Return",
      value1: `${metrics1.totalReturnPercent >= 0 ? "+" : ""}${metrics1.totalReturnPercent.toFixed(2)}%`,
      value2: `${metrics2.totalReturnPercent >= 0 ? "+" : ""}${metrics2.totalReturnPercent.toFixed(2)}%`,
      colorClass1: getValueColorClass(metrics1.totalReturnPercent, true),
      colorClass2: getValueColorClass(metrics2.totalReturnPercent, true),
      type: "percentage" as const,
    },
    {
      label: "Annualized Return",
      value1: `${metrics1.annualizedReturnPercent >= 0 ? "+" : ""}${metrics1.annualizedReturnPercent.toFixed(2)}%`,
      value2: `${metrics2.annualizedReturnPercent >= 0 ? "+" : ""}${metrics2.annualizedReturnPercent.toFixed(2)}%`,
      colorClass1: getValueColorClass(metrics1.annualizedReturnPercent, true),
      colorClass2: getValueColorClass(metrics2.annualizedReturnPercent, true),
      type: "percentage" as const,
    },
    {
      label: "Volatility",
      value1: `${metrics1.volatility.toFixed(2)}%`,
      value2: `${metrics2.volatility.toFixed(2)}%`,
      colorClass1: "",
      colorClass2: "",
      type: "percentage" as const,
    },
    {
      label: "Sortino Ratio",
      value1: metrics1.sortinoRatio.toFixed(2),
      value2: metrics2.sortinoRatio.toFixed(2),
      colorClass1: "",
      colorClass2: "",
      type: "number" as const,
    },
    {
      label: "Max Drawdown",
      value1: `${metrics1.maxDrawdown.toFixed(2)}%`,
      value2: `${metrics2.maxDrawdown.toFixed(2)}%`,
      colorClass1: getValueColorClass(metrics1.maxDrawdown, true),
      colorClass2: getValueColorClass(metrics2.maxDrawdown, true),
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
              <div className="text-center">
                <span className={cn("font-mono", row.colorClass1)}>
                  {row.value1}
                </span>
              </div>
              <div className="text-center">
                <span className={cn("font-mono", row.colorClass2)}>
                  {row.value2}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
