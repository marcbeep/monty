"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";

interface MonteCarloDistributionChartProps {
  distributionData: {
    finalValues: number[];
    returnDistribution: { return: number; probability: number }[];
  };
  median: number;
  confidenceInterval: number;
}

const CHART_CONFIG = {
  probability: {
    label: "Probability",
    color: "var(--financial-neutral)",
  },
} satisfies ChartConfig;

export function MonteCarloDistributionChart({
  distributionData,
  median,
  confidenceInterval,
}: MonteCarloDistributionChartProps) {
  // Transform return distribution data for smooth curve
  const chartData = React.useMemo(() => {
    return distributionData.returnDistribution
      .sort((a, b) => a.return - b.return)
      .map((item) => ({
        return: item.return,
        returnLabel: `${item.return >= 0 ? "+" : ""}${item.return.toFixed(1)}%`,
        probability: item.probability,
      }));
  }, [distributionData.returnDistribution]);

  // Calculate median return percentage
  const medianReturn = React.useMemo(() => {
    if (distributionData.finalValues.length === 0) return 0;
    // Assuming base investment of $100K for return calculation
    const baseValue = 100000;
    return ((median - baseValue) / baseValue) * 100;
  }, [median]);

  // Find confidence interval bounds
  const confidenceBounds = React.useMemo(() => {
    const sorted = [...chartData].sort((a, b) => a.return - b.return);
    const lowerIndex = Math.floor(
      (((100 - confidenceInterval) / 2) * sorted.length) / 100
    );
    const upperIndex =
      Math.ceil(
        ((confidenceInterval + (100 - confidenceInterval) / 2) *
          sorted.length) /
          100
      ) - 1;

    return {
      lower: sorted[lowerIndex]?.return || -20,
      upper: sorted[upperIndex]?.return || 40,
    };
  }, [chartData, confidenceInterval]);

  if (chartData.length === 0) {
    return (
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Return Distribution
          </CardTitle>
          <CardDescription>No distribution data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No data to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card bg-surface-primary shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Return Distribution
        </CardTitle>
        <CardDescription>
          Probability curve showing likelihood of different returns (
          {confidenceInterval}% confidence interval)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={CHART_CONFIG}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient
                id="probabilityGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--financial-neutral)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--financial-neutral)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="returnLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(value) => `${value}%`}
              width={45}
            />
            <ReferenceLine
              x={`${medianReturn >= 0 ? "+" : ""}${medianReturn.toFixed(1)}%`}
              stroke="var(--financial-neutral)"
              strokeDasharray="3 3"
              strokeWidth={2}
              label={{
                value: "Median",
                position: "top",
                style: {
                  textAnchor: "middle",
                  fontSize: "12px",
                  fill: "var(--muted-foreground)",
                  fontWeight: "500",
                },
              }}
            />
            <ReferenceLine
              x={`${confidenceBounds.lower >= 0 ? "+" : ""}${confidenceBounds.lower.toFixed(1)}%`}
              stroke="var(--border)"
              strokeDasharray="2 4"
              strokeWidth={1}
              strokeOpacity={0.7}
            />
            <ReferenceLine
              x={`${confidenceBounds.upper >= 0 ? "+" : ""}${confidenceBounds.upper.toFixed(1)}%`}
              stroke="var(--border)"
              strokeDasharray="2 4"
              strokeWidth={1}
              strokeOpacity={0.7}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "2 2", stroke: "var(--border)" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Return: ${value}`}
                  formatter={(value) => [
                    `${(value as number).toFixed(1)}%`,
                    "Probability",
                  ]}
                  indicator="dashed"
                />
              }
            />
            <Area
              dataKey="probability"
              type="natural"
              fill="url(#probabilityGradient)"
              stroke="var(--financial-neutral)"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
