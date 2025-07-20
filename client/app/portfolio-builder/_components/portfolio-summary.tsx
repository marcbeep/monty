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
import {
  TrendingUp,
  Shield,
  Zap,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  MiniPieChart,
  MiniPieChartLegend,
} from "@/components/ui/mini-pie-chart";
import type { AssetType, AssetAllocation, PortfolioAsset } from "@/types";

interface PortfolioSummaryProps {
  assets: PortfolioAsset[];
  riskLevel: "Low" | "Medium" | "High";
  totalAllocation: number;
  isValidAllocation: boolean;
}

export function PortfolioSummary({
  assets,
  riskLevel,
  totalAllocation,
  isValidAllocation,
}: PortfolioSummaryProps) {
  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Low":
        return Shield;
      case "Medium":
        return TrendingUp;
      case "High":
        return Zap;
      default:
        return TrendingUp;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "Medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
      case "High":
        return "bg-red-500/10 text-red-700 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  // Generate asset allocation for chart
  const assetAllocation: AssetAllocation[] = React.useMemo(() => {
    const typeMap = new Map<AssetType, number>();
    assets.forEach((asset) => {
      const current = typeMap.get(asset.type) || 0;
      typeMap.set(asset.type, current + asset.allocation);
    });

    const colors = {
      Equities: "#16a34a",
      "Fixed Income": "#22c55e",
      Alternatives: "#166534",
      Cash: "#84cc16",
    };

    return Array.from(typeMap.entries()).map(([type, percentage]) => ({
      type,
      percentage,
      color: colors[type] || "#6b7280",
    }));
  }, [assets]);

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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Allocation</span>
              <div className="flex items-center gap-2">
                <span
                  className={`font-bold ${
                    isValidAllocation ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {totalAllocation}%
                </span>
                {isValidAllocation ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Risk Level</span>
                {(() => {
                  const Icon = getRiskIcon(riskLevel);
                  return (
                    <Badge className={getRiskColor(riskLevel)}>
                      <Icon className="h-3 w-3" />
                      {riskLevel} Risk
                    </Badge>
                  );
                })()}
              </div>

              <div className="space-y-1">
                <span className="text-sm font-medium">Asset Distribution</span>
                {assetAllocation.map((allocation) => (
                  <div
                    key={allocation.type}
                    className="flex justify-between text-sm"
                  >
                    <span>{allocation.type}</span>
                    <span>{allocation.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <MiniPieChart allocations={assetAllocation} size={120} />
              <MiniPieChartLegend
                allocations={assetAllocation}
                className="text-sm mt-2"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
