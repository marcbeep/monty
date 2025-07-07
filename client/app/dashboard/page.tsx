"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { PortfolioSelector } from "@/components/portfolio-selector";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import data from "./data.json";

// Types for the portfolio data structure
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

export default function Page() {
  const portfolios = data as Portfolio[];
  const [selectedPortfolioId, setSelectedPortfolioId] = React.useState<number>(
    portfolios[0]?.id || 0
  );
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate loading state
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const selectedPortfolio =
    portfolios.find((p) => p.id === selectedPortfolioId) || portfolios[0];

  const handleAddPortfolio = () => {
    // Placeholder for add portfolio functionality
    console.log("Add portfolio clicked");
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4 md:p-6">
          <div className="@container/main flex flex-col gap-4 md:gap-6">
            <PortfolioSelector
              portfolios={portfolios}
              selectedPortfolioId={selectedPortfolioId}
              onPortfolioChange={setSelectedPortfolioId}
              onAddPortfolio={handleAddPortfolio}
              isLoading={isLoading}
            />
            <SectionCards />
            <ChartAreaInteractive />
            {!isLoading && <DataTable selectedPortfolio={selectedPortfolio} />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
