"use client";

import * as React from "react";
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
import { Building2, Landmark, Banknote, BarChart3 } from "lucide-react";
import type { Allocation, AssetType } from "@/lib/mock-data";

// Helper function to get the appropriate icon for simplified asset types
const getAssetIcon = (type: AssetType) => {
  switch (type) {
    case "Equities":
      return <Building2 className="size-4 text-financial-positive" />;
    case "Fixed Income":
      return <Landmark className="size-4 text-financial-neutral" />;
    case "Alternatives":
      return <BarChart3 className="size-4 text-financial-neutral" />;
    case "Cash":
      return <Banknote className="size-4 text-financial-neutral" />;
    default:
      return <Building2 className="size-4 text-financial-neutral" />;
  }
};

interface DataTableProps {
  allocations: Allocation[];
  isLoading?: boolean;
}

export function DataTable({ allocations, isLoading = false }: DataTableProps) {
  // Sort by allocation percentage (largest first) and take top 10 for larger portfolios
  const sortedAllocations = React.useMemo(() => {
    return allocations
      .sort((a, b) => b.allocationPercent - a.allocationPercent)
      .slice(0, 10); // Top 10 holdings for large portfolios
  }, [allocations]);

  if (isLoading) {
    return (
      <Card className="@container/card bg-surface-primary shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="overflow-x-auto overflow-y-hidden rounded-lg border">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader className="bg-surface-accent sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="font-semibold">Asset</TableHead>
                    <TableHead className="font-semibold text-center">
                      Allocation
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Current Value
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Return
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
                      <TableCell className="text-center">
                        <Skeleton className="h-4 w-12 mx-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Skeleton className="size-3" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="@container/card bg-surface-primary shadow-sm">
      <CardHeader>
        <CardTitle className="font-bold">Portfolio Holdings</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Top holdings by allocation size and performance
          </span>
          <span className="@[540px]/card:hidden">Holdings breakdown</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="overflow-x-auto overflow-y-hidden rounded-lg border">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader className="bg-surface-accent sticky top-0 z-10">
                <TableRow>
                  <TableHead className="font-semibold">Asset</TableHead>
                  <TableHead className="font-semibold text-center">
                    Allocation
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Current Value
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Return
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAllocations?.length ? (
                  sortedAllocations.map((allocation) => {
                    return (
                      <TableRow
                        key={allocation.id}
                        className="hover:bg-surface-accent"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {getAssetIcon(allocation.type)}
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {allocation.name}
                              </span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="font-mono">
                                  {allocation.symbol}
                                </span>
                                <span>•</span>
                                <span>{allocation.type}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium percentage">
                            {allocation.allocationPercent}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span className="currency">
                            {allocation.currentValue.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span
                            className={`font-medium percentage ${
                              allocation.totalReturnPercent >= 0
                                ? "text-financial-positive"
                                : "text-financial-negative"
                            }`}
                          >
                            {allocation.totalReturnPercent >= 0 ? "+" : ""}
                            {allocation.totalReturnPercent.toFixed(1)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No holdings in this portfolio.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {allocations.length > 10 && (
          <div className="mt-4 text-center">
            <span className="text-sm text-muted-foreground">
              Showing top {Math.min(sortedAllocations.length, 10)} of{" "}
              <span className="metric">{allocations.length}</span> holdings
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
