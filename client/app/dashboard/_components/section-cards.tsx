"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getPerformanceBadge } from "@/lib/badge-utils";
import type { PortfolioMetrics } from "@/types/portfolio";

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
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <Card
            key={index}
            className="@container/card overflow-hidden bg-surface-primary shadow-sm"
          >
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

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Portfolio Value Card */}
      <Card className="@container/card overflow-hidden bg-surface-primary shadow-sm">
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
            {(() => {
              const badgeConfig = getPerformanceBadge(
                metrics.totalReturnPercent,
                "return"
              );
              const Icon = badgeConfig.icon;
              return (
                <Badge
                  variant={badgeConfig.variant}
                  className={badgeConfig.className}
                >
                  <Icon className="size-3" />
                  {badgeConfig.label}
                </Badge>
              );
            })()}
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Total portfolio value from <span className="currency">$10K</span>{" "}
            start
          </div>
        </CardFooter>
      </Card>

      {/* Annualized Return Card */}
      <Card className="@container/card overflow-hidden bg-surface-primary shadow-sm">
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
            {(() => {
              const badgeConfig = getPerformanceBadge(
                metrics.annualizedReturnPercent,
                "return"
              );
              const Icon = badgeConfig.icon;
              return (
                <Badge
                  variant={badgeConfig.variant}
                  className={badgeConfig.className}
                >
                  <Icon className="size-3" />
                  {badgeConfig.label}
                </Badge>
              );
            })()}
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Expected yearly return rate
          </div>
        </CardFooter>
      </Card>

      {/* Volatility Card */}
      <Card className="@container/card overflow-hidden bg-surface-primary shadow-sm">
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
            {(() => {
              const badgeConfig = getPerformanceBadge(
                metrics.volatility,
                "volatility"
              );
              const Icon = badgeConfig.icon;
              return (
                <Badge
                  variant={badgeConfig.variant}
                  className={badgeConfig.className}
                >
                  <Icon className="size-3" />
                  {badgeConfig.label}
                </Badge>
              );
            })()}
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Annualized price fluctuation
          </div>
        </CardFooter>
      </Card>

      {/* Sortino Ratio Card */}
      <Card className="@container/card overflow-hidden bg-surface-primary shadow-sm">
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
            {(() => {
              const badgeConfig = getPerformanceBadge(
                metrics.sortinoRatio,
                "ratio"
              );
              const Icon = badgeConfig.icon;
              return (
                <Badge
                  variant={badgeConfig.variant}
                  className={badgeConfig.className}
                >
                  <Icon className="size-3" />
                  {badgeConfig.label}
                </Badge>
              );
            })()}
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Downside risk-adjusted returns
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
