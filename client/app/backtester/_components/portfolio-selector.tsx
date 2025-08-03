"use client";

import * as React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MiniPieChart,
  MiniPieChartLegend,
} from "@/components/ui/mini-pie-chart";
import { getRiskBadge } from "@/lib/badge-utils";
import type { Portfolio } from "@/types";

interface BacktesterPortfolioSelectorProps {
  portfolios: Portfolio[];
  selectedPortfolioId?: number | null;
  selectedPortfolio?: Portfolio | null; // Full portfolio data with strategy
  onPortfolioChange: (portfolioId: number) => void;
  isLoading?: boolean;
}

export function BacktesterPortfolioSelector({
  portfolios,
  selectedPortfolioId,
  selectedPortfolio: selectedPortfolioProp,
  onPortfolioChange,
  isLoading = false,
}: BacktesterPortfolioSelectorProps) {
  // Use provided selectedPortfolio (with full strategy data) or fallback to basic portfolio
  const selectedPortfolio =
    selectedPortfolioProp ||
    portfolios.find((p) => p.id === selectedPortfolioId);

  if (isLoading) {
    return (
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-96" />
              <Skeleton className="h-8 w-48" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-9 w-48" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="@container/card bg-surface-primary shadow-sm">
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="space-y-1.5">
            <CardTitle className="font-bold">
              Portfolio Backtesting & Analysis
            </CardTitle>
            <CardDescription>
              Test your portfolio with historical data, scenario analysis, and
              Monte Carlo simulation
            </CardDescription>
            {selectedPortfolio && (
              <div className="flex items-center gap-2 pt-1">
                {(() => {
                  const riskBadgeConfig = getRiskBadge(
                    selectedPortfolio.riskLevel
                  );
                  const Icon = riskBadgeConfig.icon;
                  return (
                    <Badge
                      variant="outline"
                      className={riskBadgeConfig.className}
                    >
                      <Icon className="size-3" />
                      {selectedPortfolio.riskLevel} Risk
                    </Badge>
                  );
                })()}
                <MiniPieChart
                  allocations={selectedPortfolio.strategy}
                  size={24}
                />
                <MiniPieChartLegend
                  allocations={selectedPortfolio.strategy}
                  className="text-xs"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <Select
              value={selectedPortfolioId?.toString() || ""}
              onValueChange={(value) => onPortfolioChange(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Select Portfolio" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((portfolio) => (
                  <SelectItem
                    key={portfolio.id}
                    value={portfolio.id.toString()}
                  >
                    {portfolio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
