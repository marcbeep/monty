"use client";

import * as React from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { DataTable } from "./_components/data-table";
import { PortfolioSelector } from "./_components/portfolio-selector";
import { SectionCards } from "./_components/section-cards";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { getMockDashboardData, getMockPortfolios } from "@/lib/mock-data";
import { mockApiCall, handleApiError } from "@/lib/api";
import type { DashboardData, Portfolio } from "@/types";

export default function Page() {
  const [selectedPortfolioId, setSelectedPortfolioId] =
    React.useState<number>(1);
  const [timeframe, setTimeframe] = React.useState<string>("YTD");
  const [dashboardData, setDashboardData] =
    React.useState<DashboardData | null>(null);
  const [portfolios, setPortfolios] = React.useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate dashboard API call
  const fetchDashboardData = React.useCallback(
    async (portfolioId: number, selectedTimeframe: string) => {
      setIsLoading(true);
      try {
        // Simulate API call with delay
        const data = await mockApiCall(
          getMockDashboardData(portfolioId, selectedTimeframe),
          600
        );
        setDashboardData(data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Load portfolios on mount
  React.useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const portfolioList = await mockApiCall(getMockPortfolios(), 300);
        setPortfolios(portfolioList);
      } catch (error) {
        handleApiError(error);
      }
    };
    loadPortfolios();
  }, []);

  // Fetch dashboard data when portfolio or timeframe changes
  React.useEffect(() => {
    if (selectedPortfolioId && timeframe) {
      fetchDashboardData(selectedPortfolioId, timeframe);
    }
  }, [selectedPortfolioId, timeframe, fetchDashboardData]);

  const handlePortfolioChange = (portfolioId: number) => {
    setSelectedPortfolioId(portfolioId);
  };

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

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
              onPortfolioChange={handlePortfolioChange}
              onAddPortfolio={handleAddPortfolio}
              isLoading={isLoading}
            />
            <SectionCards
              metrics={dashboardData?.metrics}
              isLoading={isLoading}
            />
            <ChartAreaInteractive
              chartData={dashboardData?.chartData || []}
              timeframe={timeframe}
              onTimeframeChange={handleTimeframeChange}
              isLoading={isLoading}
            />
            <DataTable
              allocations={dashboardData?.allocations || []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
