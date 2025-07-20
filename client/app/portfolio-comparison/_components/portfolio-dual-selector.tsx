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
  onPortfolio1Change: (portfolioId: number) => void;
  onPortfolio2Change: (portfolioId: number) => void;
  isLoading?: boolean;
}

export function PortfolioDualSelector({
  portfolios,
  selectedPortfolio1Id,
  selectedPortfolio2Id,
  onPortfolio1Change,
  onPortfolio2Change,
  isLoading = false,
}: PortfolioDualSelectorProps) {
  const portfolio1 = portfolios.find((p) => p.id === selectedPortfolio1Id);
  const portfolio2 = portfolios.find((p) => p.id === selectedPortfolio2Id);

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
        <CardTitle>Portfolio Selection</CardTitle>
        <CardDescription>Choose two portfolios to compare</CardDescription>
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
