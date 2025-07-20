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
  BarChart3,
  Play,
  TrendingUp,
  Target,
  Percent,
  Zap,
} from "lucide-react";
import type { MonteCarloParams, MonteCarloResult } from "@/types";

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
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Monte Carlo Simulation</CardTitle>
              <CardDescription>
                Generate thousands of possible future outcomes to understand
                your portfolio&apos;s potential performance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <div className="text-2xl font-bold">
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
                    <div className="text-2xl font-bold text-green-600">
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
                    <div className="text-2xl font-bold">
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
                    <div className="text-2xl font-bold">
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
                      <div className="text-red-600 font-semibold">
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
                        {(
                          monteCarloResult.outcomes.median * 0.75
                        ).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        25th percentile
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">
                        {monteCarloResult.outcomes.median.toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: "USD",
                          }
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        50th percentile
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">
                        {(
                          monteCarloResult.outcomes.median * 1.25
                        ).toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        75th percentile
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-600 font-semibold">
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

                {/* Chart Placeholders */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="h-[250px] border border-border/50 rounded-lg flex items-center justify-center bg-muted/20">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-10 w-10 mx-auto mb-2" />
                      <p>Projection Bands Chart</p>
                      <p className="text-sm">Portfolio value over time</p>
                    </div>
                  </div>
                  <div className="h-[250px] border border-border/50 rounded-lg flex items-center justify-center bg-muted/20">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-10 w-10 mx-auto mb-2" />
                      <p>Return Distribution</p>
                      <p className="text-sm">Probability histogram</p>
                    </div>
                  </div>
                </div>

                {/* Simulation Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {monteCarloResult.params.simulations.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Simulations Run
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {monteCarloResult.params.timeHorizon} years
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Time Horizon
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">
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
