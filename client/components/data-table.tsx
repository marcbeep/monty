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
  CircleDollarSign,
  BarChart3,
  Landmark,
} from "lucide-react";

// Types for the new data structure
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

// Helper function to get the appropriate icon for security type
const getSecurityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "stock":
      return <Building2 className="size-4" />;
    case "etf":
      return <BarChart3 className="size-4" />;
    case "bond etf":
      return <Landmark className="size-4" />;
    default:
      return <CircleDollarSign className="size-4" />;
  }
};

// Helper function to get badge variant for security type
const getSecurityBadgeVariant = (
  type: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (type.toLowerCase()) {
    case "stock":
      return "default";
    case "etf":
      return "secondary";
    case "bond etf":
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

export function DataTable({
  selectedPortfolio,
}: {
  selectedPortfolio: Portfolio;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="font-bold">Portfolio Holdings</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Securities and their current performance
          </span>
          <span className="@[540px]/card:hidden">Holdings overview</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead className="font-semibold">Security</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="text-right font-semibold">
                  Current Value
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Performance
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedPortfolio?.securities?.length ? (
                selectedPortfolio.securities.map((security) => (
                  <TableRow key={security.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getSecurityIcon(security.type)}
                        <span className="font-medium">{security.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getSecurityBadgeVariant(security.type)}
                        className="font-medium"
                      >
                        {security.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right currency font-medium">
                      {security.currentValue.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {getPerformanceIndicator(security.percentChange)}
                        <span
                          className={`percentage font-medium ${
                            security.percentChange >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {security.percentChange >= 0 ? "+" : ""}
                          {security.percentChange.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No securities in this portfolio.
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
