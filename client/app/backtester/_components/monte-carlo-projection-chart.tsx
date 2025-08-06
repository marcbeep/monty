"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import type { ChartDataPoint } from "@/types";

interface MonteCarloProjectionChartProps {
  projections: {
    percentile5: ChartDataPoint[];
    percentile25: ChartDataPoint[];
    percentile50: ChartDataPoint[];
    percentile75: ChartDataPoint[];
    percentile95: ChartDataPoint[];
  };
  timeHorizon: number;
  simulations: number;
}

const CHART_CONFIG = {
  percentile5: {
    label: "5th Percentile",
    color: "var(--financial-negative)",
  },
  percentile25: {
    label: "25th Percentile",
    color: "var(--asset-fixed-income)",
  },
  percentile50: {
    label: "Median",
    color: "var(--financial-neutral)",
  },
  percentile75: {
    label: "75th Percentile",
    color: "var(--asset-cash)",
  },
  percentile95: {
    label: "95th Percentile",
    color: "var(--financial-positive)",
  },
} satisfies ChartConfig;

export function MonteCarloProjectionChart({
  projections,
  timeHorizon,
  simulations,
}: MonteCarloProjectionChartProps) {
  // Transform and merge all percentile data
  const chartData = React.useMemo(() => {
    const dates = projections.percentile50.map((point) => point.date);

    return dates.map((date, index) => ({
      date,
      percentile5: projections.percentile5[index]?.value || 0,
      percentile25: projections.percentile25[index]?.value || 0,
      percentile50: projections.percentile50[index]?.value || 0,
      percentile75: projections.percentile75[index]?.value || 0,
      percentile95: projections.percentile95[index]?.value || 0,
    }));
  }, [projections]);

  // Calculate Y-axis domain
  const yDomain = React.useMemo(() => {
    if (chartData.length === 0) return [90000, 130000];

    const allValues = chartData.flatMap((d) => [
      d.percentile5,
      d.percentile25,
      d.percentile50,
      d.percentile75,
      d.percentile95,
    ]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1 || 5000;

    return [Math.max(0, min - padding), max + padding];
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Projection Bands Chart
          </CardTitle>
          <CardDescription>No projection data available</CardDescription>
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
          Projection Bands Chart
        </CardTitle>
        <CardDescription>
          Portfolio value over time - {simulations.toLocaleString()} simulations
          over {timeHorizon} years
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={CHART_CONFIG}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={chartData}>
            <YAxis domain={yDomain} hide />
            <defs>
              {/* Gradient fills using your defined color palette */}
              <linearGradient id="fill95" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--financial-positive)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--financial-positive)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="fill75" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--asset-cash)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--asset-cash)"
                  stopOpacity={0.08}
                />
              </linearGradient>
              <linearGradient id="fill50" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--financial-neutral)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--financial-neutral)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fill25" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--asset-fixed-income)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--asset-fixed-income)"
                  stopOpacity={0.08}
                />
              </linearGradient>
              <linearGradient id="fill5" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--financial-negative)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--financial-negative)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="var(--border)"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  year: "2-digit",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    });
                  }}
                  formatter={(value, name) => {
                    const labels = {
                      percentile95: "95th Percentile",
                      percentile75: "75th Percentile",
                      percentile50: "Median",
                      percentile25: "25th Percentile",
                      percentile5: "5th Percentile",
                    };
                    const formattedValue = new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    }).format(value as number);
                    const label = labels[name as keyof typeof labels] || name;
                    return [formattedValue, label];
                  }}
                  indicator="dot"
                />
              }
            />
            {/* Render areas using your financial color palette */}
            <Area
              dataKey="percentile95"
              type="monotone"
              fill="url(#fill95)"
              stroke="var(--financial-positive)"
              strokeWidth={2}
              isAnimationActive={false}
            />
            <Area
              dataKey="percentile75"
              type="monotone"
              fill="url(#fill75)"
              stroke="var(--asset-cash)"
              strokeWidth={1.5}
              isAnimationActive={false}
            />
            <Area
              dataKey="percentile50"
              type="monotone"
              fill="url(#fill50)"
              stroke="var(--financial-neutral)"
              strokeWidth={2}
              isAnimationActive={false}
            />
            <Area
              dataKey="percentile25"
              type="monotone"
              fill="url(#fill25)"
              stroke="var(--asset-fixed-income)"
              strokeWidth={1.5}
              isAnimationActive={false}
            />
            <Area
              dataKey="percentile5"
              type="monotone"
              fill="url(#fill5)"
              stroke="var(--financial-negative)"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
