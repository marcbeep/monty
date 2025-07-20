"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Play,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { getPerformanceBadge } from "@/lib/badge-utils";
import type { BacktestData, BacktestParams } from "@/types";

interface HistoricalBacktestProps {
  portfolioId: number | null;
  backtestData: BacktestData | null;
  isLoading: boolean;
  onRunBacktest: (params: BacktestParams) => void;
}

export function HistoricalBacktest({
  portfolioId,
  backtestData,
  isLoading,
  onRunBacktest,
}: HistoricalBacktestProps) {
  const [startDate, setStartDate] = React.useState("2020-01-01");
  const [endDate, setEndDate] = React.useState("2023-12-31");

  const handleRunBacktest = () => {
    if (!portfolioId) return;

    onRunBacktest({
      portfolioId,
      startDate,
      endDate,
    });
  };

  const canRunBacktest =
    portfolioId &&
    startDate &&
    endDate &&
    new Date(startDate) < new Date(endDate);

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Historical Backtesting</CardTitle>
              <CardDescription>
                Test your portfolio against historical market data with custom
                date ranges
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <Button
            onClick={handleRunBacktest}
            disabled={!canRunBacktest || isLoading}
            className="w-full md:w-auto"
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? "Running Backtest..." : "Run Historical Backtest"}
          </Button>

          {!portfolioId && (
            <p className="text-sm text-muted-foreground">
              Please select a portfolio above to run a backtest.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results Card */}
      {(backtestData || isLoading) && (
        <Card className="@container/card bg-surface-primary shadow-sm">
          <CardHeader>
            <CardTitle>Backtest Results</CardTitle>
            <CardDescription>
              {backtestData && !isLoading
                ? `Performance from ${backtestData.startDate} to ${backtestData.endDate}`
                : "Analyzing historical performance..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-[200px] w-full" />
              </div>
            ) : backtestData ? (
              <div className="space-y-6">
                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Final Value</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {backtestData.metrics.currentValue.toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const badgeConfig = getPerformanceBadge(
                          backtestData.metrics.totalReturnPercent,
                          "return"
                        );
                        const Icon = badgeConfig.icon;
                        return (
                          <Badge
                            variant={badgeConfig.variant}
                            className={badgeConfig.className}
                          >
                            <Icon className="size-3" />
                            {badgeConfig.label}
                          </Badge>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Return</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {backtestData.metrics.totalReturnPercent >= 0 ? "+" : ""}
                      {backtestData.metrics.totalReturnPercent.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {backtestData.metrics.totalReturn.toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Volatility</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {backtestData.metrics.volatility.toFixed(1)}%
                    </div>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const badgeConfig = getPerformanceBadge(
                          backtestData.metrics.volatility,
                          "volatility"
                        );
                        const Icon = badgeConfig.icon;
                        return (
                          <Badge
                            variant={badgeConfig.variant}
                            className={badgeConfig.className}
                          >
                            <Icon className="size-3" />
                            {badgeConfig.label}
                          </Badge>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Max Drawdown</span>
                    </div>
                    <div className="text-2xl font-bold">
                      -{backtestData.metrics.maxDrawdown.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Peak to trough decline
                    </div>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="h-[300px] border border-border/50 rounded-lg flex items-center justify-center bg-muted/20">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Performance Chart</p>
                    <p className="text-sm">Chart visualization coming soon</p>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {backtestData.metrics.annualizedReturnPercent.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Annualized Return
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {backtestData.metrics.sortinoRatio.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Sortino Ratio
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {Math.floor(
                        (new Date(backtestData.endDate).getTime() -
                          new Date(backtestData.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Testing Period
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
