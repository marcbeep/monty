"use client";

import * as React from "react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PortfolioDualSelector, ComparisonTable } from "./_components";
import { dashboardApi, transformSummaryToPortfolio } from "@/lib/dashboard-api";
import { handleApiError } from "@/lib/api";
import type { DashboardData, Portfolio } from "@/types";

export default function PortfolioComparisonPage() {
  const [selectedPortfolio1Id, setSelectedPortfolio1Id] =
    React.useState<number>(1);
  const [selectedPortfolio2Id, setSelectedPortfolio2Id] =
    React.useState<number>(2);
  const [timeframe, setTimeframe] = React.useState<string>("YTD");
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
          dashboardApi.getDashboardData(portfolio1Id, selectedTimeframe),
          dashboardApi.getDashboardData(portfolio2Id, selectedTimeframe),
        ]);
        setPortfolio1Data(data1);
        setPortfolio2Data(data2);
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
      } catch (error) {
        handleApiError(error);
      }
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
    <ProtectedRoute>
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
                selectedPortfolio1={portfolio1Data?.portfolio}
                selectedPortfolio2={portfolio2Data?.portfolio}
                timeframe={timeframe}
                onPortfolio1Change={setSelectedPortfolio1Id}
                onPortfolio2Change={setSelectedPortfolio2Id}
                onTimeframeChange={setTimeframe}
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
    </ProtectedRoute>
  );
}
