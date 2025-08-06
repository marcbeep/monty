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
import { BarChart3 } from "lucide-react";
import type { ChartDataPoint } from "@/types";

interface StressTestPerformanceChartProps {
  chartData: ChartDataPoint[];
  startDate: string;
  endDate: string;
}

const CHART_CONFIG = {
  portfolio: {
    label: "Portfolio Value",
    color: "var(--financial-negative)", // Red color for stress test decline
  },
} satisfies ChartConfig;

export function StressTestPerformanceChart({
  chartData,
  startDate,
  endDate,
}: StressTestPerformanceChartProps) {
  // Transform data for recharts
  const transformedData = React.useMemo(() => {
    return chartData.map((point) => ({
      date: point.date,
      portfolio: point.value,
    }));
  }, [chartData]);

  // Calculate Y-axis domain with padding
  const yDomain = React.useMemo(() => {
    if (transformedData.length === 0) return [80000, 100000]; // Default range

    const values = transformedData.map((d) => d.portfolio);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 1000; // Minimum $1000 padding

    return [Math.max(0, min - padding), max + padding];
  }, [transformedData]);

  // Determine if portfolio declined (stress test effect)
  const isDeclined =
    transformedData.length > 1 &&
    transformedData[transformedData.length - 1].portfolio <
      transformedData[0].portfolio;

  if (chartData.length === 0) {
    return (
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Chart
          </CardTitle>
          <CardDescription>
            No chart data available for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground" />
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
          <BarChart3 className="h-5 w-5" />
          Performance Chart
        </CardTitle>
        <CardDescription>
          Portfolio value change from {new Date(startDate).toLocaleDateString()}{" "}
          to {new Date(endDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={CHART_CONFIG}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={transformedData}>
            <YAxis domain={yDomain} hide />
            <defs>
              <linearGradient
                id="fillPortfolioStress"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={
                    isDeclined
                      ? "var(--financial-negative)"
                      : "var(--financial-positive)"
                  }
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={
                    isDeclined
                      ? "var(--financial-negative)"
                      : "var(--financial-positive)"
                  }
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
                // Format for stress test period (typically months/years)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
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
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  formatter={(value) => {
                    return (
                      <span className="currency">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                        }).format(value as number)}
                      </span>
                    );
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="portfolio"
              type="monotone"
              fill="url(#fillPortfolioStress)"
              stroke={
                isDeclined
                  ? "var(--financial-negative)"
                  : "var(--financial-positive)"
              }
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
