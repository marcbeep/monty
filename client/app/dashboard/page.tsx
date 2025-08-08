"use client";

import * as React from "react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { ChartAreaInteractive } from "./_components/chart-area-interactive";
import { DataTable } from "./_components/data-table";
import { PortfolioSelector } from "./_components/portfolio-selector";
import { SectionCards } from "./_components/section-cards";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LoaderScreen } from "@/components/shared/loader-screen";

import { dashboardApi, transformSummaryToPortfolio } from "@/lib/dashboard-api";
import { handleApiError } from "@/lib/api";
import type { DashboardData, Portfolio } from "@/types";

export default function Page() {
  const [selectedPortfolioId, setSelectedPortfolioId] =
    React.useState<number>(1);
  const [timeframe, setTimeframe] = React.useState<string>("YTD");
  const [dashboardData, setDashboardData] =
    React.useState<DashboardData | null>(null);
  const [portfolios, setPortfolios] = React.useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasInitialLoaded, setHasInitialLoaded] = React.useState(false);
  const [progress, setProgress] = React.useState(10);

  // Fetch dashboard API data
  const fetchDashboardData = React.useCallback(
    async (portfolioId: number, selectedTimeframe: string) => {
      setIsLoading(true);
      try {
        const data = await dashboardApi.getDashboardData(
          portfolioId,
          selectedTimeframe
        );
        setDashboardData(data);
        // If this is the first load, advance progress
        setProgress((p) => (p < 90 ? 90 : p));
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
        const portfolioSummaries = await dashboardApi.getPortfolios();
        const portfolioList = portfolioSummaries.map(
          transformSummaryToPortfolio
        );
        setPortfolios(portfolioList);
        setProgress((p) => (p < 50 ? 50 : p));
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

  // Mark initial load complete when we have data and are no longer loading
  React.useEffect(() => {
    if (
      !hasInitialLoaded &&
      !isLoading &&
      dashboardData &&
      portfolios.length > 0
    ) {
      setProgress(100);
      // Small delay to let the bar reach 100% before hiding
      const t = setTimeout(() => setHasInitialLoaded(true), 200);
      return () => clearTimeout(t);
    }
  }, [hasInitialLoaded, isLoading, dashboardData, portfolios.length]);

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
    <ProtectedRoute>
      {!hasInitialLoaded && (
        <LoaderScreen
          title="Preparing your dashboard"
          description="Fetching portfolios and market data..."
          progress={progress}
        />
      )}
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
                selectedPortfolio={dashboardData?.portfolio}
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
    </ProtectedRoute>
  );
}
