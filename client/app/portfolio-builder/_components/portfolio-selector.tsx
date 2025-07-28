"use client";

import * as React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Plus, Trash2 } from "lucide-react";
import type { PortfolioResponse } from "@/types";

interface PortfolioSelectorProps {
  portfolios: PortfolioResponse[];
  selectedPortfolioId: string | null;
  onPortfolioSelect: (portfolioId: string) => void;
  onNewPortfolio: () => void;
  onDeletePortfolio: (portfolioId: string) => void;
  isLoading?: boolean;
}

export function PortfolioSelector({
  portfolios,
  selectedPortfolioId,
  onPortfolioSelect,
  onNewPortfolio,
  onDeletePortfolio,
  isLoading = false,
}: PortfolioSelectorProps) {
  const selectedPortfolio = portfolios.find(
    (p) => p.id === selectedPortfolioId
  );

  return (
    <Card className="@container/card bg-surface-primary shadow-sm">
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
          <div className="space-y-1.5">
            <CardTitle className="font-bold flex items-center gap-2">
              <Building className="h-6 w-6" />
              Portfolio Builder
            </CardTitle>
            <CardDescription>
              Create and customize your investment portfolio strategy
            </CardDescription>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            {isLoading ? (
              <Skeleton className="w-full sm:w-[200px] h-10" />
            ) : (
              <Select
                value={selectedPortfolioId || ""}
                onValueChange={(value) => value && onPortfolioSelect(value)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select Portfolio" />
                </SelectTrigger>
                <SelectContent>
                  {portfolios.map((portfolio) => (
                    <SelectItem key={portfolio.id} value={portfolio.id}>
                      {portfolio.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {selectedPortfolio && (
              <Button
                onClick={() => onDeletePortfolio(selectedPortfolio.id)}
                variant="outline"
                size="icon"
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
            <Button
              onClick={onNewPortfolio}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Plus className="size-4" />
              New Portfolio
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
