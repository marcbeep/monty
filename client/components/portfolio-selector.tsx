"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MiniPieChart,
  MiniPieChartLegend,
} from "@/components/ui/mini-pie-chart";
import { Plus, TrendingUp, Shield, Zap } from "lucide-react";
import type { Portfolio } from "@/lib/mock-data";

// Helper function to get risk level icon
const getRiskIcon = (riskLevel: string) => {
  switch (riskLevel.toLowerCase()) {
    case "low":
      return <Shield className="size-3" />;
    case "medium":
      return <TrendingUp className="size-3" />;
    case "high":
      return <Zap className="size-3" />;
    default:
      return <TrendingUp className="size-3" />;
  }
};

// Helper function to get uniform risk level badge variant (using outline for consistency)
const getRiskBadgeVariant = (): "outline" => {
  return "outline";
};

// Helper function to get risk level color for consistent theming
const getRiskLevelColor = (riskLevel: string): string => {
  switch (riskLevel.toLowerCase()) {
    case "low":
      return "text-blue-600 border-blue-200";
    case "medium":
      return "text-amber-600 border-amber-200";
    case "high":
      return "text-red-600 border-red-200";
    default:
      return "text-gray-600 border-gray-200";
  }
};

interface PortfolioSelectorProps {
  portfolios: Portfolio[];
  selectedPortfolioId: number;
  onPortfolioChange: (portfolioId: number) => void;
  onAddPortfolio?: () => void;
  isLoading?: boolean;
}

export function PortfolioSelector({
  portfolios,
  selectedPortfolioId,
  onPortfolioChange,
  onAddPortfolio,
  isLoading = false,
}: PortfolioSelectorProps) {
  // Get selected portfolio for displaying strategy info
  const selectedPortfolio = React.useMemo(() => {
    return portfolios.find((p) => p.id === selectedPortfolioId);
  }, [portfolios, selectedPortfolioId]);

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-80" />
              <div className="flex items-center gap-2 pt-1">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
              <Skeleton className="h-9 w-full sm:w-48" />
              <Skeleton className="h-9 w-full sm:w-32" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="space-y-1.5">
            <CardTitle className="font-bold">
              Portfolio Allocation Simulator
            </CardTitle>
            <CardDescription>
              Compare allocation strategies and their performance from $10,000
              starting amount
            </CardDescription>
            {selectedPortfolio && (
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={getRiskBadgeVariant()}
                    className={`flex items-center gap-1 ${getRiskLevelColor(
                      selectedPortfolio.riskLevel
                    )}`}
                  >
                    {getRiskIcon(selectedPortfolio.riskLevel)}
                    {selectedPortfolio.riskLevel} Risk
                  </Badge>
                  <MiniPieChart
                    allocations={selectedPortfolio.strategy}
                    size={24}
                  />
                </div>
                <MiniPieChartLegend
                  allocations={selectedPortfolio.strategy}
                  className="text-xs"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            <Select
              value={selectedPortfolioId.toString()}
              onValueChange={(value) => onPortfolioChange(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-48" id="portfolio-selector">
                <SelectValue placeholder="Select portfolio" />
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
            <Button
              variant="outline"
              size="sm"
              onClick={onAddPortfolio}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Plus className="size-4" />
              New Strategy
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
