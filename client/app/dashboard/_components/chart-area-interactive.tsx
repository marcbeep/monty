"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ChartDataPoint } from "@/types";

export const DESCRIPTION =
  "Portfolio value evolution from $10K starting amount";

const CHART_CONFIG = {
  portfolio: {
    label: "Portfolio Value",
    color: "var(--financial-positive)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  chartData: ChartDataPoint[];
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  isLoading?: boolean;
}

export function ChartAreaInteractive({
  chartData,
  timeframe,
  onTimeframeChange,
  isLoading = false,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();

  // Transform data for recharts
  const transformedData = React.useMemo(() => {
    return chartData.map((point) => ({
      date: point.date,
      portfolio: point.value,
    }));
  }, [chartData]);

  // Calculate Y-axis domain with padding
  const yDomain = React.useMemo(() => {
    if (transformedData.length === 0) return [9500, 12000]; // Default range around $10K base

    const values = transformedData.map((d) => d.portfolio);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 500; // Minimum $500 padding

    return [Math.max(0, min - padding), max + padding];
  }, [transformedData]);

  if (isLoading) {
    return (
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card bg-surface-primary shadow-sm">
      <CardHeader>
        <CardTitle className="font-bold">Portfolio Value</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Portfolio value evolution from{" "}
            <span className="currency">$10,000</span> starting amount
          </span>
          <span className="@[540px]/card:hidden">Value over time</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeframe}
            onValueChange={onTimeframeChange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-3 @[767px]/card:flex"
          >
            <ToggleGroupItem value="1D" className="font-medium text-xs">
              1D
            </ToggleGroupItem>
            <ToggleGroupItem value="5D" className="font-medium text-xs">
              5D
            </ToggleGroupItem>
            <ToggleGroupItem value="1M" className="font-medium text-xs">
              1M
            </ToggleGroupItem>
            <ToggleGroupItem value="6M" className="font-medium text-xs">
              6M
            </ToggleGroupItem>
            <ToggleGroupItem value="YTD" className="font-medium text-xs">
              YTD
            </ToggleGroupItem>
            <ToggleGroupItem value="1Y" className="font-medium text-xs">
              1Y
            </ToggleGroupItem>
            <ToggleGroupItem value="5Y" className="font-medium text-xs">
              5Y
            </ToggleGroupItem>
            <ToggleGroupItem value="Max" className="font-medium text-xs">
              Max
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeframe} onValueChange={onTimeframeChange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a time period"
            >
              <SelectValue placeholder="Year to Date" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1D" className="rounded-lg font-medium">
                1 Day
              </SelectItem>
              <SelectItem value="5D" className="rounded-lg font-medium">
                5 Days
              </SelectItem>
              <SelectItem value="1M" className="rounded-lg font-medium">
                1 Month
              </SelectItem>
              <SelectItem value="6M" className="rounded-lg font-medium">
                6 Months
              </SelectItem>
              <SelectItem value="YTD" className="rounded-lg font-medium">
                Year to Date
              </SelectItem>
              <SelectItem value="1Y" className="rounded-lg font-medium">
                1 Year
              </SelectItem>
              <SelectItem value="5Y" className="rounded-lg font-medium">
                5 Years
              </SelectItem>
              <SelectItem value="Max" className="rounded-lg font-medium">
                Max
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="transition-opacity duration-300 ease-in-out">
          <ChartContainer
            config={CHART_CONFIG}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              data={transformedData}
              key={timeframe} // Force clean re-render on time range change
            >
              <YAxis domain={yDomain} hide />
              <defs>
                <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
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
                  // Format based on timeframe
                  if (timeframe === "1D") {
                    return date.toLocaleDateString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    });
                  } else if (timeframe === "5D" || timeframe === "1M") {
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  } else if (
                    timeframe === "6M" ||
                    timeframe === "YTD" ||
                    timeframe === "1Y"
                  ) {
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      year: "2-digit",
                    });
                  } else {
                    // For 5Y and Max - show year only
                    return date.toLocaleDateString("en-US", {
                      year: "numeric",
                    });
                  }
                }}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={
                  isMobile ? -1 : Math.floor(transformedData.length / 2)
                }
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
                            minimumFractionDigits: 2,
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
                fill="url(#fillPortfolio)"
                stroke="var(--financial-positive)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
