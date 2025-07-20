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
import { Building, Plus } from "lucide-react";
import type { ExistingPortfolio } from "./types";

interface PortfolioSelectorProps {
  existingPortfolios: ExistingPortfolio[];
  selectedPortfolioId: number | null;
  onPortfolioSelect: (portfolioId: number) => void;
  onNewPortfolio: () => void;
}

export function PortfolioSelector({
  existingPortfolios,
  selectedPortfolioId,
  onPortfolioSelect,
  onNewPortfolio,
}: PortfolioSelectorProps) {
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
            <Select
              value={selectedPortfolioId?.toString() || ""}
              onValueChange={(value) =>
                value ? onPortfolioSelect(Number(value)) : undefined
              }
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Portfolio" />
              </SelectTrigger>
              <SelectContent>
                {existingPortfolios.map((portfolio) => (
                  <SelectItem
                    key={portfolio.id}
                    value={portfolio.id.toString()}
                  >
                    {portfolio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
