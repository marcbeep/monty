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
import { Play, TrendingUp, Target, Percent, Zap } from "lucide-react";
import { MonteCarloProjectionChart } from "./monte-carlo-projection-chart";
import { MonteCarloDistributionChart } from "./monte-carlo-distribution-chart";
import type { MonteCarloParams, MonteCarloResult } from "@/types/backtester";

interface MonteCarloSimulationProps {
  portfolioId: number | null;
  monteCarloResult: MonteCarloResult | null;
  isLoading: boolean;
  onRunSimulation: (params: MonteCarloParams) => void;
}

export function MonteCarloSimulation({
  portfolioId,
  monteCarloResult,
  isLoading,
  onRunSimulation,
}: MonteCarloSimulationProps) {
  const [timeHorizon, setTimeHorizon] = React.useState(10);
  const [simulations, setSimulations] = React.useState(10000);
  const [confidenceInterval, setConfidenceInterval] = React.useState(95);

  const handleRunSimulation = () => {
    if (!portfolioId) return;

    onRunSimulation({
      portfolioId,
      timeHorizon,
      simulations,
      confidenceInterval,
    });
  };

  const canRunSimulation = portfolioId && timeHorizon > 0 && simulations > 0;

  return (
    <div className="space-y-6">
      {/* Configuration Card */}
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <CardTitle>Monte Carlo Simulation</CardTitle>
          <CardDescription>
            Generate thousands of possible future outcomes to understand your
            portfolio&apos;s potential performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="time-horizon">Time Horizon (Years)</Label>
              <Input
                id="time-horizon"
                type="number"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(Number(e.target.value))}
                min={1}
                max={50}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="simulations">Number of Simulations</Label>
              <Select
                value={simulations.toString()}
                onValueChange={(value) => setSimulations(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1,000</SelectItem>
                  <SelectItem value="5000">5,000</SelectItem>
                  <SelectItem value="10000">10,000</SelectItem>
                  <SelectItem value="50000">50,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence">Confidence Interval</Label>
              <Select
                value={confidenceInterval.toString()}
                onValueChange={(value) => setConfidenceInterval(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                  <SelectItem value="99">99%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleRunSimulation}
            disabled={!canRunSimulation || isLoading}
            className="w-full md:w-auto"
          >
            <Play className="h-4 w-4 mr-2" />
            {isLoading
              ? "Running Simulation..."
              : "Start Monte Carlo Simulation"}
          </Button>

          {!portfolioId && (
            <p className="text-sm text-muted-foreground">
              Please select a portfolio above to run a Monte Carlo simulation.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results Card */}
      {(monteCarloResult || isLoading) && (
        <Card className="@container/card bg-surface-primary shadow-sm">
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
            <CardDescription>
              {monteCarloResult && !isLoading
                ? `${monteCarloResult.params.simulations.toLocaleString()} simulations over ${
                    monteCarloResult.params.timeHorizon
                  } years`
                : "Running Monte Carlo analysis..."}
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
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : monteCarloResult ? (
              <div className="space-y-6">
                {/* Key Outcomes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Median Outcome
                      </span>
                    </div>
                    <div className="text-lg font-semibold currency truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
                      {monteCarloResult.outcomes.median.toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      50th percentile
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Best Case</span>
                    </div>
                    <div className="text-lg font-semibold text-financial-positive currency truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
                      {monteCarloResult.outcomes.bestCase.toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      95th percentile
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Probability of Profit
                      </span>
                    </div>
                    <div className="text-lg font-semibold percentage truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
                      {monteCarloResult.outcomes.probabilityOfProfit.toFixed(1)}
                      %
                    </div>
                    <Badge
                      variant={
                        monteCarloResult.outcomes.probabilityOfProfit > 70
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {monteCarloResult.outcomes.probabilityOfProfit > 70
                        ? "High"
                        : "Moderate"}{" "}
                      Confidence
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Double Investment
                      </span>
                    </div>
                    <div className="text-lg font-semibold percentage truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
                      {monteCarloResult.outcomes.probabilityOfDoubling.toFixed(
                        1
                      )}
                      %
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Chance to 2x
                    </div>
                  </div>
                </div>

                {/* Projections Range */}
                <div className="border border-border/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Projection Range</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-financial-negative font-semibold">
                        {monteCarloResult.outcomes.worstCase.toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: "USD",
                          }
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        5th percentile
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">
                        {(() => {
                          const percentile25 =
                            monteCarloResult.projections.percentile25;
                          const finalValue =
                            percentile25.length > 0
                              ? percentile25[percentile25.length - 1].value
                              : monteCarloResult.outcomes.median * 0.8;
                          return finalValue.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          });
                        })()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        25th percentile
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-financial-neutral">
                        {(() => {
                          const percentile50 =
                            monteCarloResult.projections.percentile50;
                          const finalValue =
                            percentile50.length > 0
                              ? percentile50[percentile50.length - 1].value
                              : monteCarloResult.outcomes.median;
                          return finalValue.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          });
                        })()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        50th percentile
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">
                        {(() => {
                          const percentile75 =
                            monteCarloResult.projections.percentile75;
                          const finalValue =
                            percentile75.length > 0
                              ? percentile75[percentile75.length - 1].value
                              : monteCarloResult.outcomes.median * 1.2;
                          return finalValue.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          });
                        })()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        75th percentile
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-financial-positive font-semibold">
                        {monteCarloResult.outcomes.bestCase.toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: "USD",
                          }
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        95th percentile
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monte Carlo Charts */}
                <div className="space-y-6">
                  <MonteCarloProjectionChart
                    projections={monteCarloResult.projections}
                    timeHorizon={monteCarloResult.params.timeHorizon}
                    simulations={monteCarloResult.params.simulations}
                  />

                  <MonteCarloDistributionChart
                    distributionData={monteCarloResult.distributionData}
                    median={monteCarloResult.outcomes.median}
                    confidenceInterval={
                      monteCarloResult.params.confidenceInterval
                    }
                  />
                </div>

                {/* Simulation Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-lg font-semibold metric">
                      {monteCarloResult.params.simulations.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Simulations Run
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold metric">
                      {monteCarloResult.params.timeHorizon} years
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Time Horizon
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold percentage">
                      {monteCarloResult.params.confidenceInterval}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Confidence Level
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
