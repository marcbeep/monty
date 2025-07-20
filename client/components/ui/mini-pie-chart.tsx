"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { AssetAllocation } from "@/types";

interface MiniPieChartProps {
  allocations: AssetAllocation[];
  size?: number;
  className?: string;
}

export function MiniPieChart({
  allocations,
  size = 32,
  className,
}: MiniPieChartProps) {
  const radius = size / 2;
  const strokeWidth = 2;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Calculate cumulative percentages for stroke-dasharray
  let cumulativePercentage = 0;
  const segments = allocations.map((allocation) => {
    const startPercentage = cumulativePercentage;
    cumulativePercentage += allocation.percentage;
    const strokeDasharray = `${
      (allocation.percentage / 100) * circumference
    } ${circumference}`;
    const strokeDashoffset = -((startPercentage / 100) * circumference);

    return {
      ...allocation,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className={cn("inline-flex", className)}>
      <svg height={size} width={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-muted-foreground/20"
        />

        {/* Allocation segments */}
        {segments.map((segment, index) => (
          <circle
            key={`${segment.type}-${index}`}
            stroke={segment.color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={segment.strokeDasharray}
            strokeDashoffset={segment.strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-300"
          />
        ))}
      </svg>
    </div>
  );
}

interface MiniPieChartLegendProps {
  allocations: AssetAllocation[];
  className?: string;
}

export function MiniPieChartLegend({
  allocations,
  className,
}: MiniPieChartLegendProps) {
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {allocations.map((allocation) => (
        <div key={allocation.type} className="flex items-center gap-1 text-xs">
          <div
            className="size-2 rounded-full shrink-0"
            style={{ backgroundColor: allocation.color }}
          />
          <span className="text-muted-foreground">
            {allocation.percentage}% {allocation.type}
          </span>
        </div>
      ))}
    </div>
  );
}
