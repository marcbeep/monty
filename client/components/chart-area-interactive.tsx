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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "An interactive portfolio value area chart";

const chartData = [
  { date: "2024-04-01", portfolio: 11250.45 },
  { date: "2024-04-02", portfolio: 11320.78 },
  { date: "2024-04-03", portfolio: 11180.23 },
  { date: "2024-04-04", portfolio: 11450.67 },
  { date: "2024-04-05", portfolio: 11680.34 },
  { date: "2024-04-06", portfolio: 11590.12 },
  { date: "2024-04-07", portfolio: 11420.89 },
  { date: "2024-04-08", portfolio: 11890.56 },
  { date: "2024-04-09", portfolio: 10980.23 },
  { date: "2024-04-10", portfolio: 11260.78 },
  { date: "2024-04-11", portfolio: 11530.45 },
  { date: "2024-04-12", portfolio: 11390.67 },
  { date: "2024-04-13", portfolio: 11740.23 },
  { date: "2024-04-14", portfolio: 11080.45 },
  { date: "2024-04-15", portfolio: 10950.78 },
  { date: "2024-04-16", portfolio: 11120.34 },
  { date: "2024-04-17", portfolio: 11980.67 },
  { date: "2024-04-18", portfolio: 11840.23 },
  { date: "2024-04-19", portfolio: 11430.89 },
  { date: "2024-04-20", portfolio: 10890.56 },
  { date: "2024-04-21", portfolio: 11020.34 },
  { date: "2024-04-22", portfolio: 11340.78 },
  { date: "2024-04-23", portfolio: 11180.45 },
  { date: "2024-04-24", portfolio: 11780.23 },
  { date: "2024-04-25", portfolio: 11450.67 },
  { date: "2024-04-26", portfolio: 10980.34 },
  { date: "2024-04-27", portfolio: 11890.12 },
  { date: "2024-04-28", portfolio: 11120.89 },
  { date: "2024-04-29", portfolio: 11650.56 },
  { date: "2024-04-30", portfolio: 12040.23 },
  { date: "2024-05-01", portfolio: 11280.78 },
  { date: "2024-05-02", portfolio: 11670.45 },
  { date: "2024-05-03", portfolio: 11430.67 },
  { date: "2024-05-04", portfolio: 11890.23 },
  { date: "2024-05-05", portfolio: 12180.89 },
  { date: "2024-05-06", portfolio: 12340.56 },
  { date: "2024-05-07", portfolio: 11890.34 },
  { date: "2024-05-08", portfolio: 11150.78 },
  { date: "2024-05-09", portfolio: 11340.23 },
  { date: "2024-05-10", portfolio: 11670.45 },
  { date: "2024-05-11", portfolio: 11820.67 },
  { date: "2024-05-12", portfolio: 11560.89 },
  { date: "2024-05-13", portfolio: 11560.34 },
  { date: "2024-05-14", portfolio: 12240.78 },
  { date: "2024-05-15", portfolio: 12450.23 },
  { date: "2024-05-16", portfolio: 12180.67 },
  { date: "2024-05-17", portfolio: 12560.34 },
  { date: "2024-05-18", portfolio: 11890.12 },
  { date: "2024-05-19", portfolio: 11450.89 },
  { date: "2024-05-20", portfolio: 11280.56 },
  { date: "2024-05-21", portfolio: 10890.23 },
  { date: "2024-05-22", portfolio: 10870.78 },
  { date: "2024-05-23", portfolio: 11560.45 },
  { date: "2024-05-24", portfolio: 11780.67 },
  { date: "2024-05-25", portfolio: 11420.23 },
  { date: "2024-05-26", portfolio: 11540.89 },
  { date: "2024-05-27", portfolio: 12240.56 },
  { date: "2024-05-28", portfolio: 11560.34 },
  { date: "2024-05-29", portfolio: 10980.78 },
  { date: "2024-05-30", portfolio: 11980.23 },
  { date: "2024-05-31", portfolio: 11240.67 },
  { date: "2024-06-01", portfolio: 11240.45 },
  { date: "2024-06-02", portfolio: 12450.89 },
  { date: "2024-06-03", portfolio: 11080.34 },
  { date: "2024-06-04", portfolio: 12180.78 },
  { date: "2024-06-05", portfolio: 10980.23 },
  { date: "2024-06-06", portfolio: 11780.67 },
  { date: "2024-06-07", portfolio: 12040.45 },
  { date: "2024-06-08", portfolio: 11890.23 },
  { date: "2024-06-09", portfolio: 12340.89 },
  { date: "2024-06-10", portfolio: 11250.56 },
  { date: "2024-06-11", portfolio: 11020.34 },
  { date: "2024-06-12", portfolio: 12560.78 },
  { date: "2024-06-13", portfolio: 10980.23 },
  { date: "2024-06-14", portfolio: 12180.67 },
  { date: "2024-06-15", portfolio: 11980.45 },
  { date: "2024-06-16", portfolio: 12140.89 },
  { date: "2024-06-17", portfolio: 12450.23 },
  { date: "2024-06-18", portfolio: 11080.78 },
  { date: "2024-06-19", portfolio: 11980.34 },
  { date: "2024-06-20", portfolio: 12240.67 },
  { date: "2024-06-21", portfolio: 11340.45 },
  { date: "2024-06-22", portfolio: 12040.89 },
  { date: "2024-06-23", portfolio: 12560.23 },
  { date: "2024-06-24", portfolio: 11120.78 },
  { date: "2024-06-25", portfolio: 11240.34 },
  { date: "2024-06-26", portfolio: 12180.67 },
  { date: "2024-06-27", portfolio: 12340.45 },
  { date: "2024-06-28", portfolio: 11250.89 },
  { date: "2024-06-29", portfolio: 11080.23 },
  { date: "2024-06-30", portfolio: 12450.78 },
];

const chartConfig = {
  portfolio: {
    label: "Portfolio Value",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("7d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  // Calculate dynamic min/max for Y-axis
  const values = filteredData.map((d) => d.portfolio);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const margin = (maxValue - minValue) * 0.08 || 100; // fallback margin if flat
  const yMin = Math.floor(minValue - margin);
  const yMax = Math.ceil(maxValue + margin);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="font-bold">Portfolio Value</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total portfolio value over time
          </span>
          <span className="@[540px]/card:hidden">Portfolio performance</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="7d" className="font-medium">
              Past Week
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="font-medium">
              Past Month
            </ToggleGroupItem>
            <ToggleGroupItem value="90d" className="font-medium">
              Past 3 Months
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Past Week" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg font-medium">
                Past Week
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg font-medium">
                Past Month
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg font-medium">
                Past 3 Months
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="transition-opacity duration-300 ease-in-out">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              data={filteredData}
              key={timeRange} // Force clean re-render on time range change
            >
              <YAxis domain={[yMin, yMax]} hide />
              <defs>
                <linearGradient id="fillPortfolio" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-portfolio)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-portfolio)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    formatter={(value) => {
                      return new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 2,
                      }).format(value as number);
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="portfolio"
                type="monotone"
                fill="url(#fillPortfolio)"
                stroke="var(--color-portfolio)"
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
