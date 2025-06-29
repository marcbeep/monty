"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export function DataTable({ data }: { data: Portfolio[] }) {
  const [selectedPortfolioId, setSelectedPortfolioId] = React.useState<number>(
    data[0]?.id || 0
  );
  const selectedPortfolio =
    data.find((p) => p.id === selectedPortfolioId) || data[0];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6 py-2">
        <div className="flex items-center gap-2">
          <Select
            value={selectedPortfolioId.toString()}
            onValueChange={(value) => setSelectedPortfolioId(Number(value))}
          >
            <SelectTrigger className="w-48" id="portfolio-selector">
              <SelectValue placeholder="Select a portfolio" />
            </SelectTrigger>
            <SelectContent>
              {data.map((portfolio) => (
                <SelectItem key={portfolio.id} value={portfolio.id.toString()}>
                  {portfolio.portfolio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm">
          + Add Portfolio
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border mx-4 lg:mx-6">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>Security Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Current Value</TableHead>
              <TableHead className="text-right">% Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedPortfolio?.securities?.length ? (
              selectedPortfolio.securities.map((security) => (
                <TableRow key={security.id}>
                  <TableCell>{security.name}</TableCell>
                  <TableCell>{security.type}</TableCell>
                  <TableCell className="text-right">
                    {security.currentValue.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        security.percentChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {security.percentChange >= 0 ? "+" : ""}
                      {security.percentChange.toFixed(2)}%
                    </span>
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
    </div>
  );
}
