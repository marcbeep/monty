"use client";

import * as React from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PortfolioDualSelector, ComparisonTable } from "./_components";
import {
  getMockDashboardData,
  getMockPortfolios,
  mockApiCall,
} from "@/lib/mock-data";
import type { DashboardData, Portfolio } from "@/types";

export default function PortfolioComparisonPage() {
  const [selectedPortfolio1Id, setSelectedPortfolio1Id] =
    React.useState<number>(1);
  const [selectedPortfolio2Id, setSelectedPortfolio2Id] =
    React.useState<number>(2);
  const timeframe = "YTD"; // Hardcoded since it's not currently changeable
  const [portfolio1Data, setPortfolio1Data] =
    React.useState<DashboardData | null>(null);
  const [portfolio2Data, setPortfolio2Data] =
    React.useState<DashboardData | null>(null);
  const [portfolios, setPortfolios] = React.useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch comparison data for both portfolios
  const fetchComparisonData = React.useCallback(
    async (
      portfolio1Id: number,
      portfolio2Id: number,
      selectedTimeframe: string
    ) => {
      setIsLoading(true);
      try {
        const [data1, data2] = await Promise.all([
          mockApiCall(
            getMockDashboardData(portfolio1Id, selectedTimeframe),
            600
          ),
          mockApiCall(
            getMockDashboardData(portfolio2Id, selectedTimeframe),
            600
          ),
        ]);
        setPortfolio1Data(data1);
        setPortfolio2Data(data2);
      } catch (error) {
        console.error("Failed to fetch comparison data:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Load portfolios on mount
  React.useEffect(() => {
    const loadPortfolios = async () => {
      const portfolioList = await mockApiCall(getMockPortfolios(), 300);
      setPortfolios(portfolioList);
    };
    loadPortfolios();
  }, []);

  // Fetch data when portfolios or timeframe changes
  React.useEffect(() => {
    if (selectedPortfolio1Id && selectedPortfolio2Id && timeframe) {
      fetchComparisonData(
        selectedPortfolio1Id,
        selectedPortfolio2Id,
        timeframe
      );
    }
  }, [
    selectedPortfolio1Id,
    selectedPortfolio2Id,
    timeframe,
    fetchComparisonData,
  ]);

  const portfolio1 = portfolios.find((p) => p.id === selectedPortfolio1Id);
  const portfolio2 = portfolios.find((p) => p.id === selectedPortfolio2Id);

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
            {/* Portfolio Selection */}
            <PortfolioDualSelector
              portfolios={portfolios}
              selectedPortfolio1Id={selectedPortfolio1Id}
              selectedPortfolio2Id={selectedPortfolio2Id}
              onPortfolio1Change={setSelectedPortfolio1Id}
              onPortfolio2Change={setSelectedPortfolio2Id}
              isLoading={portfolios.length === 0}
            />

            {/* Comparison Results */}
            <ComparisonTable
              portfolio1={portfolio1}
              portfolio2={portfolio2}
              metrics1={portfolio1Data?.metrics}
              metrics2={portfolio2Data?.metrics}
              isLoading={isLoading}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
