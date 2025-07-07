"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Plus } from "lucide-react";

// Types for the portfolio data structure
interface Security {
  id: number;
  name: string;
  type: string;
  currentValue: number;
  percentChange: number;
}

interface Portfolio {
  id: number;
  portfolio: string;
  securities: Security[];
}

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
  const selectedPortfolio = portfolios.find(
    (p) => p.id === selectedPortfolioId
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                <Skeleton className="h-9 w-full sm:w-48" />
                <Skeleton className="h-9 w-full sm:w-32" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-1" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">
              Portfolio Dashboard
            </CardTitle>
            <CardDescription>
              Select a portfolio to view its holdings and performance
            </CardDescription>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
            <Select
              value={selectedPortfolioId.toString()}
              onValueChange={(value) => onPortfolioChange(Number(value))}
            >
              <SelectTrigger className="w-full sm:w-48" id="portfolio-selector">
                <SelectValue placeholder="Select a portfolio" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((portfolio) => (
                  <SelectItem
                    key={portfolio.id}
                    value={portfolio.id.toString()}
                  >
                    {portfolio.portfolio}
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
              Add Portfolio
            </Button>
          </div>
        </div>
      </CardHeader>
      {selectedPortfolio && (
        <CardContent className="pt-0">
          <div className="flex flex-col space-y-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <span>
              <strong className="text-foreground">
                {selectedPortfolio.portfolio}
              </strong>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>{selectedPortfolio.securities.length} securities</span>
            <span className="hidden sm:inline">•</span>
            <span>
              Total value:{" "}
              {selectedPortfolio.securities
                .reduce((sum, security) => sum + security.currentValue, 0)
                .toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
