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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  Shield,
  AlertTriangle,
  Play,
  BarChart3,
  TrendingDown,
  Clock,
} from "lucide-react";
import { getPerformanceBadge } from "@/lib/badge-utils";
import type { ScenarioEvent, ScenarioResult } from "@/types";

interface ScenarioAnalysisProps {
  portfolioId: number | null;
  scenarios: ScenarioEvent[];
  scenarioResults: ScenarioResult[];
  isLoading: boolean;
  onRunScenario: (scenarioId: string) => void;
}

export function ScenarioAnalysis({
  portfolioId,
  scenarios,
  scenarioResults,
  isLoading,
  onRunScenario,
}: ScenarioAnalysisProps) {
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
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "High":
        return "bg-orange-500/10 text-orange-700 border-orange-500/20";
      case "Extreme":
        return "bg-red-500/10 text-red-700 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Scenarios Selection Card */}
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle>Scenario Analysis</CardTitle>
              <CardDescription>
                Test how your portfolio performs during major market events and
                crises
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!portfolioId ? (
            <p className="text-sm text-muted-foreground">
              Please select a portfolio above to run scenario analysis.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="border border-border/50 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{scenario.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {scenario.description}
                      </p>
                    </div>
                    <Badge className={getSeverityColor(scenario.severity)}>
                      {(() => {
                        const Icon = getSeverityIcon(scenario.severity);
                        return <Icon className="h-3 w-3 mr-1" />;
                      })()}
                      {scenario.severity}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      {scenario.startDate} to {scenario.endDate}
                    </span>
                    <span>•</span>
                    <span>{scenario.marketConditions}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRunScenario(scenario.id)}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isLoading ? "Running..." : "Run Scenario"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Cards */}
      {scenarioResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Scenario Results</h3>
          {scenarioResults.map((result) => (
            <Card
              key={result.scenario.id}
              className="@container/card bg-surface-primary shadow-sm"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10">
                      {(() => {
                        const Icon = getSeverityIcon(result.scenario.severity);
                        return <Icon className="h-4 w-4 text-orange-600" />;
                      })()}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {result.scenario.name}
                      </CardTitle>
                      <CardDescription>
                        Impact on {result.portfolio.name}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(result.scenario.severity)}>
                    {result.scenario.severity} Impact
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Performance Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Crisis Impact
                        </span>
                      </div>
                      <div className="text-xl font-bold text-red-600">
                        -{result.recovery.maxDrawdown.toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Maximum decline
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Recovery Time
                        </span>
                      </div>
                      <div className="text-xl font-bold">
                        {result.recovery.timeToRecover} days
                      </div>
                      <div className="text-sm text-muted-foreground">
                        To pre-crisis level
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          Final Performance
                        </span>
                      </div>
                      <div className="text-xl font-bold">
                        {result.afterMetrics.totalReturnPercent >= 0 ? "+" : ""}
                        {result.afterMetrics.totalReturnPercent.toFixed(1)}%
                      </div>
                      <div className="flex items-center gap-2">
                        {(() => {
                          const badgeConfig = getPerformanceBadge(
                            result.afterMetrics.totalReturnPercent,
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
                  </div>

                  {/* Performance Comparison */}
                  <div className="border border-border/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">
                      Performance Breakdown
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">
                          Before Crisis
                        </div>
                        <div className="font-semibold">
                          {result.beforeMetrics.currentValue.toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "USD",
                            }
                          )}
                        </div>
                        <div className="text-xs text-green-600">
                          +{result.beforeMetrics.totalReturnPercent.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">
                          During Crisis
                        </div>
                        <div className="font-semibold">
                          {result.duringMetrics.currentValue.toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "USD",
                            }
                          )}
                        </div>
                        <div className="text-xs text-red-600">
                          -{result.recovery.maxDrawdown.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground mb-1">
                          After Recovery
                        </div>
                        <div className="font-semibold">
                          {result.afterMetrics.currentValue.toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "USD",
                            }
                          )}
                        </div>
                        <div
                          className={`text-xs ${
                            result.afterMetrics.totalReturnPercent >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {result.afterMetrics.totalReturnPercent >= 0
                            ? "+"
                            : ""}
                          {result.afterMetrics.totalReturnPercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="h-[200px] border border-border/50 rounded-lg flex items-center justify-center bg-muted/20">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Scenario Timeline Chart</p>
                      <p className="text-xs">Visualization coming soon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && scenarioResults.length === 0 && (
        <Card className="@container/card bg-surface-primary shadow-sm">
          <CardHeader>
            <CardTitle>Running Scenario Analysis...</CardTitle>
            <CardDescription>
              Analyzing portfolio performance during the selected market
              scenario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-[200px] w-full" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
