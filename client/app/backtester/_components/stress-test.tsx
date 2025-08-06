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
  Play,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Clock,
} from "lucide-react";
import { getReturnBadge, getPerformanceBadge } from "@/lib/badge-utils";
import { StressTestPerformanceChart } from "./stress-test-performance-chart";
import { StressTestDrawdownChart } from "./stress-test-drawdown-chart";
import type { StressTestParams, StressTestResult } from "@/types/backtester";

interface StressTestProps {
  portfolioId: number | null;
  stressTestResult: StressTestResult | null;
  isLoading: boolean;
  onRunStressTest: (params: StressTestParams) => void;
}

// Predefined date ranges for quick selection
type QuickPreset =
  | { label: string; months: number }
  | { label: string; startDate: string; endDate: string };

const QUICK_PRESETS: QuickPreset[] = [
  { label: "Last Year", months: 12 },
  { label: "Last 3 Years", months: 36 },
  { label: "Last 5 Years", months: 60 },
  { label: "2008 Crisis", startDate: "2007-10-01", endDate: "2009-03-31" },
  { label: "2020 COVID", startDate: "2020-02-01", endDate: "2020-06-30" },
  { label: "Dot-com Bubble", startDate: "2000-03-01", endDate: "2002-10-31" },
  { label: "European Debt", startDate: "2011-05-01", endDate: "2012-12-31" },
];

export function StressTest({
  portfolioId,
  stressTestResult,
  isLoading,
  onRunStressTest,
}: StressTestProps) {
  const [startDate, setStartDate] = React.useState("2020-01-01");
  const [endDate, setEndDate] = React.useState("2023-12-31");
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(
    null
  );

  const handleRunTest = () => {
    if (!portfolioId) return;

    onRunStressTest({
      portfolioId,
      mode: "historical",
      historical: {
        startDate,
        endDate,
      },
    });
  };

  const handleQuickPreset = (preset: QuickPreset) => {
    if ("startDate" in preset && "endDate" in preset) {
      setStartDate(preset.startDate);
      setEndDate(preset.endDate);
      setSelectedPreset(preset.label);
    } else {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - preset.months);

      setEndDate(endDate.toISOString().split("T")[0]);
      setStartDate(startDate.toISOString().split("T")[0]);
      setSelectedPreset(preset.label);
    }
  };

  const canRunTest =
    portfolioId &&
    startDate &&
    endDate &&
    new Date(startDate) < new Date(endDate);

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <CardTitle>Stress Test</CardTitle>
          <CardDescription>
            Test your portfolio performance using quick presets for historical
            periods and crisis scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Presets */}
          <div className="space-y-3">
            <Label>Quick Presets</Label>
            <div className="flex flex-wrap gap-2">
              {QUICK_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.label;
                return (
                  <Button
                    key={preset.label}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuickPreset(preset)}
                    className={
                      isSelected ? "bg-primary text-primary-foreground" : ""
                    }
                  >
                    {preset.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Date Configuration */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setSelectedPreset(null); // Clear preset when manually changed
                  }}
                  max={endDate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setSelectedPreset(null); // Clear preset when manually changed
                  }}
                  min={startDate}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          {/* Run Test Button */}
          <Button
            onClick={handleRunTest}
            disabled={!canRunTest || isLoading}
            className="w-full md:w-auto"
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading ? "Running Stress Test..." : "Run Stress Test"}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {!portfolioId ? (
        <Card className="@container/card bg-surface-primary shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Please select a portfolio above to run stress tests.
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Card className="@container/card bg-surface-primary shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @xl/main:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      ) : stressTestResult ? (
        <Card className="@container/card bg-surface-primary shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Stress Test Results
            </CardTitle>
            <CardDescription>
              Performance from{" "}
              {new Date(
                stressTestResult.timeRange.startDate
              ).toLocaleDateString()}{" "}
              to{" "}
              {new Date(
                stressTestResult.timeRange.endDate
              ).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-4 @lg/main:grid-cols-2 @xl/main:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Total Return
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {stressTestResult.metrics.totalReturnPercent >= 0
                      ? "+"
                      : ""}
                    {stressTestResult.metrics.totalReturnPercent?.toFixed(2) ??
                      "N/A"}
                    %
                  </span>
                  {(() => {
                    const badge = getReturnBadge(
                      stressTestResult.metrics.totalReturnPercent ?? 0
                    );
                    const Icon = badge.icon;
                    return (
                      <Badge variant="outline" className={badge.className}>
                        <Icon className="size-3" />
                      </Badge>
                    );
                  })()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingDown className="h-4 w-4" />
                  Max Drawdown
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {stressTestResult.metrics.maxDrawdown?.toFixed(2) ?? "N/A"}%
                  </span>
                  {(() => {
                    const badge = getPerformanceBadge(
                      stressTestResult.metrics.maxDrawdown ?? 0,
                      "drawdown"
                    );
                    const Icon = badge.icon;
                    return (
                      <Badge variant="outline" className={badge.className}>
                        <Icon className="size-3" />
                      </Badge>
                    );
                  })()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Current Value
                </div>
                <div className="text-2xl font-bold">
                  {(() => {
                    const currentValue =
                      stressTestResult.chartData?.length > 0
                        ? stressTestResult.chartData[
                            stressTestResult.chartData.length - 1
                          ].value
                        : (stressTestResult.metrics.currentValue ?? 0);
                    return currentValue.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    });
                  })()}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  Sharpe Ratio
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {stressTestResult.metrics.annualizedReturn &&
                    stressTestResult.metrics.volatility
                      ? (
                          stressTestResult.metrics.annualizedReturn /
                          stressTestResult.metrics.volatility
                        ).toFixed(2)
                      : "N/A"}
                  </span>
                  {(() => {
                    const sharpeValue =
                      stressTestResult.metrics.annualizedReturn &&
                      stressTestResult.metrics.volatility
                        ? stressTestResult.metrics.annualizedReturn /
                          stressTestResult.metrics.volatility
                        : 0;
                    const badge = getPerformanceBadge(sharpeValue, "ratio");
                    const Icon = badge.icon;
                    return (
                      <Badge variant="outline" className={badge.className}>
                        <Icon className="size-3" />
                      </Badge>
                    );
                  })()}
                </div>
              </div>

              {stressTestResult.recovery?.timeToRecover && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Recovery Time
                  </div>
                  <div className="text-2xl font-bold">
                    {stressTestResult.recovery.timeToRecover} days
                  </div>
                </div>
              )}
            </div>

            {/* Performance Charts */}
            <div className="space-y-6">
              <StressTestPerformanceChart
                chartData={stressTestResult.chartData}
                startDate={stressTestResult.timeRange.startDate}
                endDate={stressTestResult.timeRange.endDate}
              />

              <StressTestDrawdownChart
                drawdownData={stressTestResult.drawdownData}
                maxDrawdown={stressTestResult.metrics.maxDrawdown}
                startDate={stressTestResult.timeRange.startDate}
                endDate={stressTestResult.timeRange.endDate}
              />
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
