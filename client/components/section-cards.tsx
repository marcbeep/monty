import { TrendingUp, TrendingDown, Target } from "lucide-react";

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
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-40" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  const getPerformanceIcon = (value: number) => {
    return value >= 0 ? (
      <TrendingUp className="size-3" />
    ) : (
      <TrendingDown className="size-3" />
    );
  };

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getBadgeVariant = (
    value: number
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (value > 10) return "default";
    if (value > 0) return "secondary";
    return "destructive";
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
          <div className="line-clamp-1 flex items-center gap-2 font-medium w-full min-w-0">
            <Badge
              variant={getBadgeVariant(metrics.totalReturnPercent)}
              className="shrink-0"
            >
              {getPerformanceIcon(metrics.totalReturn)}
              <span
                className={`currency ${getPerformanceColor(
                  metrics.totalReturn
                )}`}
              >
                {metrics.totalReturn >= 0 ? "+" : ""}
                {metrics.totalReturn.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </Badge>
            <span className="truncate">from $10K start</span>
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            {metrics.totalReturnPercent >= 0 ? "+" : ""}
            {metrics.totalReturnPercent.toFixed(1)}% total return since YTD
          </div>
        </CardFooter>
      </Card>

      {/* YTD Performance Card */}
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            YTD Return
          </CardDescription>
          <CardTitle className="text-lg font-semibold percentage truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
            {metrics.ytdReturnPercent >= 0 ? "+" : ""}
            {metrics.ytdReturnPercent.toFixed(1)}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex items-center gap-2 font-medium w-full min-w-0">
            <Badge variant="outline" className="shrink-0">
              {getPerformanceIcon(metrics.dayChangePercent)}
              <span
                className={`percentage ${getPerformanceColor(
                  metrics.dayChangePercent
                )}`}
              >
                {metrics.dayChangePercent >= 0 ? "+" : ""}
                {metrics.dayChangePercent.toFixed(2)}%
              </span>
            </Badge>
            <span className="truncate">today&apos;s change</span>
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Year-to-date performance since Jan 1
          </div>
        </CardFooter>
      </Card>

      {/* Max Drawdown Card */}
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Max Drawdown
          </CardDescription>
          <CardTitle className="text-lg font-semibold percentage truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
            {metrics.maxDrawdown.toFixed(1)}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex items-center gap-2 font-medium w-full min-w-0">
            <Badge variant="outline" className="shrink-0">
              <TrendingDown className="size-3" />
              <span className="percentage">Risk metric</span>
            </Badge>
            <span className="truncate">worst decline</span>
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Largest peak-to-trough decline YTD
          </div>
        </CardFooter>
      </Card>

      {/* Sharpe Ratio Card */}
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Sharpe Ratio
          </CardDescription>
          <CardTitle className="text-lg font-semibold metric truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
            {metrics.sharpeRatio.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex items-center gap-2 font-medium w-full min-w-0">
            <Badge variant="outline" className="shrink-0">
              <Target className="size-3" />
              <span className="metric">
                {metrics.sharpeRatio > 1
                  ? "Excellent"
                  : metrics.sharpeRatio > 0.5
                  ? "Good"
                  : "Fair"}
              </span>
            </Badge>
            <span className="truncate">risk-adjusted</span>
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Risk-adjusted return efficiency
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
