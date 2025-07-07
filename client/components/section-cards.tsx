import { TrendingUp, TrendingDown, Target, BarChart3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PortfolioMetrics } from "@/lib/mock-data";

interface SectionCardsProps {
  metrics?: PortfolioMetrics;
  isLoading?: boolean;
}

export function SectionCards({
  metrics,
  isLoading = false,
}: SectionCardsProps) {
  if (isLoading || !metrics) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="@container/card overflow-hidden">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
              <div className="flex items-center gap-2 w-full">
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-40" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Helper function to get performance evaluation
  const getPerformanceEvaluation = (
    value: number,
    type: "return" | "volatility" | "ratio" | "drawdown"
  ) => {
    switch (type) {
      case "return":
        if (value >= 15)
          return {
            label: "Excellent",
            color: "text-green-600 border-green-200",
          };
        if (value >= 8)
          return { label: "Good", color: "text-blue-600 border-blue-200" };
        if (value >= 0)
          return { label: "Fair", color: "text-amber-600 border-amber-200" };
        return { label: "Poor", color: "text-red-600 border-red-200" };

      case "volatility":
        if (value <= 8)
          return {
            label: "Low Risk",
            color: "text-green-600 border-green-200",
          };
        if (value <= 15)
          return {
            label: "Moderate",
            color: "text-amber-600 border-amber-200",
          };
        return { label: "High Risk", color: "text-red-600 border-red-200" };

      case "ratio":
        if (value >= 1.5)
          return {
            label: "Excellent",
            color: "text-green-600 border-green-200",
          };
        if (value >= 1.0)
          return { label: "Good", color: "text-blue-600 border-blue-200" };
        if (value >= 0.5)
          return { label: "Fair", color: "text-amber-600 border-amber-200" };
        return { label: "Poor", color: "text-red-600 border-red-200" };

      case "drawdown":
        if (value >= -5)
          return {
            label: "Low Risk",
            color: "text-green-600 border-green-200",
          };
        if (value >= -15)
          return {
            label: "Moderate",
            color: "text-amber-600 border-amber-200",
          };
        return { label: "High Risk", color: "text-red-600 border-red-200" };
    }
  };

  const getPerformanceIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="size-3" />
    ) : (
      <TrendingDown className="size-3" />
    );
  };

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Portfolio Value Card */}
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Portfolio Value
          </CardDescription>
          <CardTitle className="text-lg font-semibold currency truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
            {metrics.currentValue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                getPerformanceEvaluation(metrics.totalReturnPercent, "return")
                  .color
              }
            >
              {getPerformanceIcon(metrics.totalReturn)}
              {
                getPerformanceEvaluation(metrics.totalReturnPercent, "return")
                  .label
              }
            </Badge>
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Total portfolio value from $10K start
          </div>
        </CardFooter>
      </Card>

      {/* Annualized Return Card */}
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Annualized Return
          </CardDescription>
          <CardTitle className="text-lg font-semibold percentage truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
            {metrics.annualizedReturnPercent >= 0 ? "+" : ""}
            {metrics.annualizedReturnPercent.toFixed(1)}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                getPerformanceEvaluation(
                  metrics.annualizedReturnPercent,
                  "return"
                ).color
              }
            >
              <BarChart3 className="size-3" />
              {
                getPerformanceEvaluation(
                  metrics.annualizedReturnPercent,
                  "return"
                ).label
              }
            </Badge>
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Expected yearly return rate
          </div>
        </CardFooter>
      </Card>

      {/* Volatility Card */}
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Volatility
          </CardDescription>
          <CardTitle className="text-lg font-semibold percentage truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
            {metrics.volatility.toFixed(1)}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                getPerformanceEvaluation(metrics.volatility, "volatility").color
              }
            >
              <TrendingDown className="size-3" />
              {getPerformanceEvaluation(metrics.volatility, "volatility").label}
            </Badge>
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Annualized price fluctuation
          </div>
        </CardFooter>
      </Card>

      {/* Sortino Ratio Card */}
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Sortino Ratio
          </CardDescription>
          <CardTitle className="text-lg font-semibold metric truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
            {metrics.sortinoRatio.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                getPerformanceEvaluation(metrics.sortinoRatio, "ratio").color
              }
            >
              <Target className="size-3" />
              {getPerformanceEvaluation(metrics.sortinoRatio, "ratio").label}
            </Badge>
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Downside risk-adjusted returns
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
