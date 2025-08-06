"use client";

import * as React from "react";
import {
  Line,
  LineChart,
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
import { TrendingDown } from "lucide-react";
import type { DrawdownDataPoint } from "@/types/backtester";

interface StressTestDrawdownChartProps {
  drawdownData: DrawdownDataPoint[];
  maxDrawdown: number;
  startDate: string;
  endDate: string;
}

const CHART_CONFIG = {
  drawdown: {
    label: "Drawdown %",
    color: "var(--financial-negative)",
  },
} satisfies ChartConfig;

export function StressTestDrawdownChart({
  drawdownData,
  maxDrawdown,
  startDate,
  endDate,
}: StressTestDrawdownChartProps) {
  // Transform data for recharts
  const transformedData = React.useMemo(() => {
    return drawdownData.map((point) => ({
      date: point.date,
      drawdown: point.drawdown,
      peak: point.peak,
      value: point.value,
    }));
  }, [drawdownData]);

  // Calculate Y-axis domain for drawdown (negative values)
  const yDomain = React.useMemo(() => {
    if (transformedData.length === 0) return [-30, 5]; // Default range

    const drawdowns = transformedData.map((d) => d.drawdown);
    const min = Math.min(...drawdowns);
    const padding = Math.abs(min) * 0.1 || 2; // Minimum 2% padding

    return [min - padding, 5]; // Cap at 5% positive
  }, [transformedData]);

  if (drawdownData.length === 0) {
    return (
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Drawdown Analysis
          </CardTitle>
          <CardDescription>
            No drawdown data available for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <TrendingDown className="h-8 w-8 mx-auto text-muted-foreground" />
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
          <TrendingDown className="h-5 w-5" />
          Drawdown Analysis
        </CardTitle>
        <CardDescription>
          Peak-to-trough decline from {new Date(startDate).toLocaleDateString()}{" "}
          to {new Date(endDate).toLocaleDateString()}
          {maxDrawdown && (
            <span className="ml-2 text-financial-negative font-medium">
              Max: {maxDrawdown.toFixed(2)}%
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={CHART_CONFIG}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart data={transformedData}>
            <YAxis
              domain={yDomain}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
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
                  day: "numeric",
                });
              }}
            />
            <ReferenceLine
              y={0}
              stroke="var(--border)"
              strokeDasharray="2 2"
              strokeOpacity={0.7}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: "2 2" }}
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
                  formatter={(value, name, props) => {
                    const { payload } = props;
                    return [
                      <div key="drawdown" className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-financial-negative font-medium">
                            {(value as number).toFixed(2)}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            drawdown
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-0.5">
                          <div>Peak: ${payload?.peak?.toLocaleString()}</div>
                          <div>
                            Current: ${payload?.value?.toLocaleString()}
                          </div>
                        </div>
                      </div>,
                    ];
                  }}
                  indicator="dot"
                />
              }
            />
            <Line
              dataKey="drawdown"
              type="monotone"
              stroke="var(--financial-negative)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
