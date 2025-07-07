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

// Helper function to get risk level badge variant
const getRiskBadgeVariant = (
  riskLevel: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (riskLevel.toLowerCase()) {
    case "low":
      return "secondary";
    case "medium":
      return "default";
    case "high":
      return "destructive";
    default:
      return "outline";
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
              <div className="flex items-center gap-2 pt-1">
                <Badge
                  variant={getRiskBadgeVariant(selectedPortfolio.riskLevel)}
                  className="flex items-center gap-1"
                >
                  {getRiskIcon(selectedPortfolio.riskLevel)}
                  {selectedPortfolio.riskLevel} Risk
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedPortfolio.strategy}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            <Select
              value={selectedPortfolioId.toString()}
              onValueChange={(value) => onPortfolioChange(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-48" id="portfolio-selector">
                <SelectValue placeholder="Select allocation strategy" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((portfolio) => (
                  <SelectItem
                    key={portfolio.id}
                    value={portfolio.id.toString()}
                    className="space-y-1"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{portfolio.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {portfolio.strategy}
                      </span>
                    </div>
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
