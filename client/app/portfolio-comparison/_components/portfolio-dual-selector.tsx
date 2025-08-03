"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  MiniPieChart,
  MiniPieChartLegend,
} from "@/components/ui/mini-pie-chart";
import { getRiskBadge } from "@/lib/badge-utils";
import type { Portfolio } from "@/types";

interface PortfolioDualSelectorProps {
  portfolios: Portfolio[];
  selectedPortfolio1Id?: number;
  selectedPortfolio2Id?: number;
  selectedPortfolio1?: Portfolio; // Full portfolio data with strategy
  selectedPortfolio2?: Portfolio; // Full portfolio data with strategy
  timeframe?: string;
  onPortfolio1Change: (portfolioId: number) => void;
  onPortfolio2Change: (portfolioId: number) => void;
  onTimeframeChange?: (timeframe: string) => void;
  isLoading?: boolean;
}

export function PortfolioDualSelector({
  portfolios,
  selectedPortfolio1Id,
  selectedPortfolio2Id,
  selectedPortfolio1: selectedPortfolio1Prop,
  selectedPortfolio2: selectedPortfolio2Prop,
  timeframe = "YTD",
  onPortfolio1Change,
  onPortfolio2Change,
  onTimeframeChange,
  isLoading = false,
}: PortfolioDualSelectorProps) {
  // Use provided full portfolio data (with strategy) or fallback to basic portfolio
  const portfolio1 =
    selectedPortfolio1Prop ||
    portfolios.find((p) => p.id === selectedPortfolio1Id);
  const portfolio2 =
    selectedPortfolio2Prop ||
    portfolios.find((p) => p.id === selectedPortfolio2Id);

  if (isLoading) {
    return (
      <Card className="bg-surface-primary shadow-sm">
        <CardHeader>
          <CardTitle>Portfolio Selection</CardTitle>
          <CardDescription>Choose two portfolios to compare</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 @lg/main:grid-cols-2">
            {[1, 2].map((index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface-primary shadow-sm">
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="space-y-1.5">
            <CardTitle>Portfolio Selection</CardTitle>
            <CardDescription>Choose two portfolios to compare</CardDescription>
          </div>
          {onTimeframeChange && (
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
              <ToggleGroup
                type="single"
                value={timeframe}
                onValueChange={onTimeframeChange}
                variant="outline"
                className="hidden sm:flex"
              >
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
              </ToggleGroup>
              <Select value={timeframe} onValueChange={onTimeframeChange}>
                <SelectTrigger className="w-40 sm:hidden">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1M">1 Month</SelectItem>
                  <SelectItem value="6M">6 Months</SelectItem>
                  <SelectItem value="YTD">Year to Date</SelectItem>
                  <SelectItem value="1Y">1 Year</SelectItem>
                  <SelectItem value="5Y">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 @lg/main:grid-cols-2">
          {/* Portfolio A */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Portfolio A
              </label>
              <Select
                value={selectedPortfolio1Id?.toString()}
                onValueChange={(value) => onPortfolio1Change(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select first portfolio" />
                </SelectTrigger>
                <SelectContent>
                  {portfolios.map((portfolio) => (
                    <SelectItem
                      key={portfolio.id}
                      value={portfolio.id.toString()}
                    >
                      {portfolio.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {portfolio1 && <PortfolioPreview portfolio={portfolio1} />}
          </div>

          {/* Portfolio B */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Portfolio B
              </label>
              <Select
                value={selectedPortfolio2Id?.toString()}
                onValueChange={(value) => onPortfolio2Change(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select second portfolio" />
                </SelectTrigger>
                <SelectContent>
                  {portfolios.map((portfolio) => (
                    <SelectItem
                      key={portfolio.id}
                      value={portfolio.id.toString()}
                    >
                      {portfolio.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {portfolio2 && <PortfolioPreview portfolio={portfolio2} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Portfolio Preview Component
interface PortfolioPreviewProps {
  portfolio: Portfolio;
}

function PortfolioPreview({ portfolio }: PortfolioPreviewProps) {
  const riskBadgeConfig = getRiskBadge(portfolio.riskLevel);
  const Icon = riskBadgeConfig.icon;

  return (
    <div className="p-3 border rounded-lg bg-muted/50 space-y-3">
      <div className="flex items-center gap-2">
        <Badge
          variant={riskBadgeConfig.variant}
          className={riskBadgeConfig.className}
        >
          <Icon className="size-3" />
          {portfolio.riskLevel} Risk
        </Badge>
        <Badge variant="outline">{portfolio.type}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">{portfolio.description}</p>
      <div className="flex items-center gap-3">
        <MiniPieChart allocations={portfolio.strategy} size={32} />
        <MiniPieChartLegend
          allocations={portfolio.strategy}
          className="text-xs"
        />
      </div>
    </div>
  );
}
