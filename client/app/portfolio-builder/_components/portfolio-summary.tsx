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
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle } from "lucide-react";
import {
  MiniPieChart,
  MiniPieChartLegend,
} from "@/components/ui/mini-pie-chart";
import type { AssetType, AssetAllocation, PortfolioAsset } from "@/types";

interface PortfolioSummaryProps {
  assets: PortfolioAsset[];
  totalAllocation: number;
  isValidAllocation: boolean;
}

export function PortfolioSummary({
  assets,
  totalAllocation,
  isValidAllocation,
}: PortfolioSummaryProps) {
  // Generate asset allocation for chart using centralized color scheme
  const assetAllocation: AssetAllocation[] = React.useMemo(() => {
    const typeMap = new Map<AssetType, number>();
    assets.forEach((asset) => {
      const current = typeMap.get(asset.type) || 0;
      typeMap.set(asset.type, current + asset.allocation);
    });

    // Use chart colors from the centralized theme
    const colors = {
      Equities: "hsl(var(--chart-1))",
      "Fixed Income": "hsl(var(--chart-2))",
      Alternatives: "hsl(var(--chart-3))",
      Cash: "hsl(var(--chart-4))",
    };

    return Array.from(typeMap.entries()).map(([type, percentage]) => ({
      type,
      percentage,
      color: colors[type] || "hsl(var(--chart-5))",
    }));
  }, [assets]);

  // Generate individual asset allocations for detailed view
  const individualAssets = assets.filter((asset) => asset.allocation > 0);

  if (assets.length === 0) {
    return null;
  }

  return (
    <Card className="@container/card bg-surface-primary shadow-sm">
      <CardHeader>
        <CardTitle className="font-bold">Portfolio Summary</CardTitle>
        <CardDescription>
          Preview your portfolio allocation and validation status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Allocation Details */}
          <div className="space-y-4">
            {/* Total Allocation Status */}
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Allocation</span>
              <div className="flex items-center gap-2">
                <span
                  className={`font-numerical font-bold ${
                    isValidAllocation
                      ? "text-financial-positive"
                      : "text-financial-negative"
                  }`}
                >
                  {totalAllocation}%
                </span>
                {isValidAllocation ? (
                  <CheckCircle className="h-4 w-4 text-financial-positive" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-financial-negative" />
                )}
              </div>
            </div>

            <Separator />

            {/* Asset Class Distribution */}
            {assetAllocation.length > 0 && (
              <div className="space-y-3">
                <span className="text-sm font-medium">
                  Asset Class Distribution
                </span>
                <div className="space-y-2">
                  {assetAllocation.map((allocation) => (
                    <div
                      key={allocation.type}
                      className="flex justify-between items-center text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: allocation.color }}
                        />
                        <span className="text-muted-foreground">
                          {allocation.type}
                        </span>
                      </div>
                      <span className="font-numerical font-medium">
                        {allocation.percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Asset Allocations */}
            {individualAssets.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <span className="text-sm font-medium">Individual Assets</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {individualAssets.map((asset) => (
                      <div
                        key={asset.symbol}
                        className="flex justify-between items-center text-sm py-1"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="font-medium text-foreground">
                            {asset.symbol}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs border-financial-neutral text-financial-neutral"
                          >
                            {asset.type}
                          </Badge>
                        </div>
                        <span className="font-numerical font-medium ml-2">
                          {asset.allocation}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Pie Chart */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {assetAllocation.length > 0 ? (
              <div className="text-center">
                <MiniPieChart allocations={assetAllocation} size={140} />
                <MiniPieChartLegend
                  allocations={assetAllocation}
                  className="text-sm mt-3"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-center text-muted-foreground">
                <div>
                  <div className="w-16 h-16 rounded-full border-4 border-dashed border-border mx-auto mb-2" />
                  <p className="text-sm">Add allocations to see distribution</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
