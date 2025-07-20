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
import { Target, TrendingUp } from "lucide-react";
import { getRiskBadge } from "@/lib/badge-utils";
import type { Portfolio } from "@/types";

interface BacktesterPortfolioSelectorProps {
  portfolios: Portfolio[];
  selectedPortfolioId?: number | null;
  onPortfolioChange: (portfolioId: number) => void;
  isLoading?: boolean;
}

export function BacktesterPortfolioSelector({
  portfolios,
  selectedPortfolioId,
  onPortfolioChange,
  isLoading = false,
}: BacktesterPortfolioSelectorProps) {
  const selectedPortfolio = portfolios.find(
    (p) => p.id === selectedPortfolioId
  );

  if (isLoading) {
    return (
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-1" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="@container/card bg-surface-primary shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Select Portfolio for Backtesting
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                Choose a portfolio to analyze with historical backtesting,
                scenario analysis, and Monte Carlo simulation
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:ml-auto">
            <Select
              value={selectedPortfolioId?.toString() || ""}
              onValueChange={(value) => onPortfolioChange(Number(value))}
            >
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Select a portfolio..." />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((portfolio) => (
                  <SelectItem
                    key={portfolio.id}
                    value={portfolio.id.toString()}
                  >
                    <div className="flex items-center gap-2">
                      <span>{portfolio.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {portfolio.riskLevel} Risk
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedPortfolio && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{selectedPortfolio.name}</h4>
                  {(() => {
                    const badgeConfig = getRiskBadge(
                      selectedPortfolio.riskLevel
                    );
                    const Icon = badgeConfig.icon;
                    return (
                      <Badge className={badgeConfig.className}>
                        <Icon className="h-3 w-3" />
                        {badgeConfig.label}
                      </Badge>
                    );
                  })()}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedPortfolio.description}
                </p>
              </div>

              <div className="flex justify-center md:justify-end">
                <div className="text-center">
                  <MiniPieChart
                    allocations={selectedPortfolio.strategy}
                    size={80}
                  />
                  <MiniPieChartLegend
                    allocations={selectedPortfolio.strategy}
                    className="text-xs mt-2 max-w-[200px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
    </Card>
  );
}
