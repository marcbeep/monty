"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Landmark,
  Bitcoin,
  Banknote,
  PieChart,
} from "lucide-react";
import type { Allocation } from "@/lib/mock-data";

// Helper function to get the appropriate icon for allocation type
const getAllocationIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "stock etf":
      return <Building2 className="size-4" />;
    case "growth etf":
      return <TrendingUp className="size-4" />;
    case "bond etf":
      return <Landmark className="size-4" />;
    case "international etf":
      return <BarChart3 className="size-4" />;
    case "crypto":
      return <Bitcoin className="size-4" />;
    case "cash":
      return <Banknote className="size-4" />;
    default:
      return <PieChart className="size-4" />;
  }
};

// Helper function to get badge variant for allocation type
const getAllocationBadgeVariant = (
  type: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (type.toLowerCase()) {
    case "stock etf":
      return "default";
    case "growth etf":
      return "default";
    case "bond etf":
      return "secondary";
    case "international etf":
      return "outline";
    case "crypto":
      return "destructive";
    case "cash":
      return "outline";
    default:
      return "outline";
  }
};

// Helper function to get performance indicator
const getPerformanceIndicator = (percentChange: number): React.ReactNode => {
  if (percentChange > 0) {
    return <TrendingUp className="size-3 text-green-600" />;
  } else if (percentChange < 0) {
    return <TrendingDown className="size-3 text-red-600" />;
  } else {
    return <Minus className="size-3 text-muted-foreground" />;
  }
};

// Helper function to calculate contribution to portfolio performance
const calculateContribution = (
  allocation: Allocation,
  totalPortfolioValue: number
): number => {
  // Contribution = (allocation return / total portfolio value) * 100
  return (
    (allocation.totalReturn / (totalPortfolioValue - allocation.totalReturn)) *
    100
  );
};

interface DataTableProps {
  allocations: Allocation[];
  isLoading?: boolean;
}

export function DataTable({ allocations, isLoading = false }: DataTableProps) {
  // Calculate total portfolio value for contribution calculations
  const totalPortfolioValue = React.useMemo(() => {
    return allocations.reduce(
      (sum, allocation) => sum + allocation.currentValue,
      0
    );
  }, [allocations]);

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                <TableRow>
                  <TableHead className="font-semibold">Asset</TableHead>
                  <TableHead className="font-semibold">Allocation</TableHead>
                  <TableHead className="text-right font-semibold">
                    Current Value
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Contribution
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4].map((index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-4" />
                        <div className="flex flex-col">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start">
                        <Skeleton className="h-6 w-12" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton className="size-3" />
                        <div className="flex flex-col items-end">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="font-bold">Portfolio Allocation</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Asset allocation strategy and performance contribution
          </span>
          <span className="@[540px]/card:hidden">Allocation breakdown</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead className="font-semibold">Asset</TableHead>
                <TableHead className="font-semibold">Allocation</TableHead>
                <TableHead className="text-right font-semibold">
                  Current Value
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Contribution
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocations?.length ? (
                allocations.map((allocation) => {
                  const contribution = calculateContribution(
                    allocation,
                    totalPortfolioValue
                  );
                  return (
                    <TableRow key={allocation.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getAllocationIcon(allocation.type)}
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {allocation.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {allocation.symbol}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start">
                          <Badge
                            variant={getAllocationBadgeVariant(allocation.type)}
                            className="font-medium mb-1"
                          >
                            {allocation.allocationPercent}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {allocation.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right currency font-medium">
                        <div className="flex flex-col items-end">
                          <span>
                            {allocation.currentValue.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {allocation.totalReturn >= 0 ? "+" : ""}
                            {allocation.totalReturn.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}{" "}
                            return
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {getPerformanceIndicator(
                            allocation.totalReturnPercent
                          )}
                          <div className="flex flex-col items-end">
                            <span
                              className={`percentage font-medium ${
                                allocation.totalReturnPercent >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {allocation.totalReturnPercent >= 0 ? "+" : ""}
                              {allocation.totalReturnPercent.toFixed(1)}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {contribution >= 0 ? "+" : ""}
                              {contribution.toFixed(1)}% to portfolio
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No allocations in this portfolio.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
