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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Shield,
  AlertTriangle,
  Clock,
  Calendar,
  Target,
} from "lucide-react";
import { getReturnBadge } from "@/lib/badge-utils";
import type {
  StressTestParams,
  StressTestResult,
  ScenarioEvent,
} from "@/types/backtester";

interface StressTestProps {
  portfolioId: number | null;
  stressTestResult: StressTestResult | null;
  isLoading: boolean;
  onRunStressTest: (params: StressTestParams) => void;
}

// Predefined scenarios
const PREDEFINED_SCENARIOS: ScenarioEvent[] = [
  {
    id: "financial-crisis-2008",
    name: "2008 Financial Crisis",
    description: "Subprime mortgage crisis and global financial meltdown",
    startDate: "2007-10-01",
    endDate: "2009-03-31",
    marketConditions: "Severe market downturn, banking crisis, credit freeze",
    severity: "Extreme",
  },
  {
    id: "covid-crash-2020",
    name: "2020 COVID-19 Crash",
    description: "Global pandemic-induced market crash and recovery",
    startDate: "2020-02-01",
    endDate: "2020-06-30",
    marketConditions: "Rapid market decline followed by unprecedented recovery",
    severity: "High",
  },
  {
    id: "dotcom-bubble-2000",
    name: "Dot-com Bubble Burst",
    description: "Technology stock crash and NASDAQ collapse",
    startDate: "2000-03-01",
    endDate: "2002-10-31",
    marketConditions: "Technology sector collapse, recession fears",
    severity: "High",
  },
  {
    id: "european-debt-2011",
    name: "European Debt Crisis",
    description: "Sovereign debt crisis in European Union",
    startDate: "2011-05-01",
    endDate: "2012-12-31",
    marketConditions: "European sovereign debt concerns, banking stress",
    severity: "Medium",
  },
];

// Quick preset date ranges
type QuickPreset =
  | { label: string; months: number }
  | { label: string; startDate: string; endDate: string };

const QUICK_PRESETS: QuickPreset[] = [
  { label: "Last Year", months: 12 },
  { label: "Last 3 Years", months: 36 },
  { label: "Last 5 Years", months: 60 },
  { label: "2008 Crisis", startDate: "2007-10-01", endDate: "2009-03-31" },
  { label: "2020 COVID", startDate: "2020-02-01", endDate: "2020-06-30" },
];

export function StressTest({
  portfolioId,
  stressTestResult,
  isLoading,
  onRunStressTest,
}: StressTestProps) {
  const [mode, setMode] = React.useState<"historical" | "scenario">(
    "historical"
  );
  const [startDate, setStartDate] = React.useState("2020-01-01");
  const [endDate, setEndDate] = React.useState("2023-12-31");
  const [selectedScenario, setSelectedScenario] = React.useState<string | null>(
    null
  );
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(
    null
  );

  const handleRunTest = () => {
    if (!portfolioId) return;

    if (mode === "historical") {
      onRunStressTest({
        portfolioId,
        mode: "historical",
        historical: {
          startDate,
          endDate,
        },
      });
    } else if (mode === "scenario" && selectedScenario) {
      onRunStressTest({
        portfolioId,
        mode: "scenario",
        scenario: {
          scenarioId: selectedScenario,
        },
      });
    }
  };

  const handleQuickPreset = (preset: QuickPreset) => {
    if ("startDate" in preset && "endDate" in preset) {
      setStartDate(preset.startDate);
      setEndDate(preset.endDate);
    } else {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - preset.months);

      setEndDate(endDate.toISOString().split("T")[0]);
      setStartDate(startDate.toISOString().split("T")[0]);
    }
    setSelectedPreset(preset.label);
  };

  const canRunTest =
    portfolioId &&
    ((mode === "historical" &&
      startDate &&
      endDate &&
      new Date(startDate) < new Date(endDate)) ||
      (mode === "scenario" && selectedScenario));

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Low":
        return Shield;
      case "Medium":
        return TrendingDown;
      case "High":
        return AlertTriangle;
      case "Extreme":
        return AlertTriangle;
      default:
        return Shield;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-financial-positive-subtle text-financial-positive border-financial-positive";
      case "Medium":
        return "bg-surface-accent text-financial-neutral border-financial-neutral";
      case "High":
        return "bg-financial-negative-subtle text-financial-negative border-financial-negative";
      case "Extreme":
        return "bg-financial-negative-subtle text-financial-negative border-financial-negative";
      default:
        return "bg-surface-accent text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <CardTitle>Stress Test</CardTitle>
          <CardDescription>
            Test your portfolio against historical periods or predefined crisis
            scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selector */}
          <div className="space-y-3">
            <Label>Test Mode</Label>
            <Select
              value={mode}
              onValueChange={(value) => setMode(value as typeof mode)}
            >
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="historical">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Historical Period
                  </div>
                </SelectItem>
                <SelectItem value="scenario">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Predefined Scenarios
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Historical Mode Configuration */}
          {mode === "historical" && (
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

              {/* Quick Presets */}
              <div className="space-y-2">
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
            </div>
          )}

          {/* Scenario Mode Configuration */}
          {mode === "scenario" && (
            <div className="space-y-4">
              <Label>Select Crisis Scenario</Label>
              <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2">
                {PREDEFINED_SCENARIOS.map((scenario) => {
                  const SeverityIcon = getSeverityIcon(scenario.severity);
                  const isSelected = selectedScenario === scenario.id;

                  return (
                    <div
                      key={scenario.id}
                      className={`border rounded-lg p-4 space-y-3 cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border/50 hover:border-border"
                      }`}
                      onClick={() => setSelectedScenario(scenario.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{scenario.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {scenario.description}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={getSeverityColor(scenario.severity)}
                        >
                          <SeverityIcon className="size-3" />
                          {scenario.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(
                            scenario.startDate
                          ).toLocaleDateString()} -{" "}
                          {new Date(scenario.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
              {stressTestResult.scenario && (
                <Badge variant="outline" className="ml-2">
                  {stressTestResult.scenario.name}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {stressTestResult.mode === "historical"
                ? `Performance from ${new Date(stressTestResult.timeRange.startDate).toLocaleDateString()} to ${new Date(stressTestResult.timeRange.endDate).toLocaleDateString()}`
                : `Scenario analysis: ${stressTestResult.scenario?.description}`}
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
                    {stressTestResult.metrics.totalReturn?.toFixed(2) ?? "N/A"}%
                  </span>
                  {(() => {
                    const badge = getReturnBadge(
                      stressTestResult.metrics.totalReturn ?? 0
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
                <div className="text-2xl font-bold text-financial-negative">
                  {stressTestResult.recovery?.maxDrawdown?.toFixed(2) ?? "N/A"}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Current Value
                </div>
                <div className="text-2xl font-bold">
                  $
                  {stressTestResult.metrics.currentValue?.toLocaleString() ??
                    "N/A"}
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

            {/* Performance Chart Placeholder */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Performance Chart</h3>
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Chart visualization will be implemented when backend API is
                    available
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
