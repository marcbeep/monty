"use client";

import * as React from "react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BacktesterPortfolioSelector,
  StressTest,
  MonteCarloSimulation,
} from "./_components";
import { dashboardApi, transformSummaryToPortfolio } from "@/lib/dashboard-api";
import { useErrorHandler } from "@/hooks/use-error-handler";
import type { Portfolio } from "@/types";
import type {
  StressTestParams,
  StressTestResult,
  MonteCarloParams,
  MonteCarloResult,
} from "@/types/backtester";

export default function BacktesterPage() {
  const { handleError } = useErrorHandler();

  // State management
  const [selectedPortfolioId, setSelectedPortfolioId] = React.useState<
    number | null
  >(null);
  const [portfolios, setPortfolios] = React.useState<Portfolio[]>([]);
  const [selectedPortfolioData, setSelectedPortfolioData] =
    React.useState<Portfolio | null>(null);
  const [activeTab, setActiveTab] = React.useState<"stresstest" | "montecarlo">(
    "stresstest"
  );

  // Stress test state
  const [stressTestResult, setStressTestResult] =
    React.useState<StressTestResult | null>(null);
  const [isStressTestLoading, setIsStressTestLoading] = React.useState(false);

  // Monte Carlo simulation state
  const [monteCarloResult, setMonteCarloResult] =
    React.useState<MonteCarloResult | null>(null);
  const [isMonteCarloLoading, setIsMonteCarloLoading] = React.useState(false);

  // Load initial data
  React.useEffect(() => {
    const loadInitialData = async () => {
      try {
        // TODO: Implement real backtester API endpoints
        const portfolioSummaries = await dashboardApi.getPortfolios();
        const portfolioList = portfolioSummaries.map(
          transformSummaryToPortfolio
        );
        setPortfolios(portfolioList);
      } catch (error) {
        handleError(error);
      }
    };
    loadInitialData();
  }, [handleError]);

  // Fetch full portfolio data when selected portfolio changes
  React.useEffect(() => {
    const fetchSelectedPortfolioData = async () => {
      if (!selectedPortfolioId) {
        setSelectedPortfolioData(null);
        return;
      }

      try {
        // Get full portfolio data from dashboard API (includes strategy)
        const dashboardData = await dashboardApi.getDashboardData(
          selectedPortfolioId,
          "YTD"
        );
        setSelectedPortfolioData(dashboardData.portfolio);
      } catch (error) {
        handleError(error);
        // Fallback to summary data if dashboard data fails
        const fallbackPortfolio = portfolios.find(
          (p) => p.id === selectedPortfolioId
        );
        setSelectedPortfolioData(fallbackPortfolio || null);
      }
    };

    fetchSelectedPortfolioData();
  }, [selectedPortfolioId, portfolios, handleError]);

  // Handle portfolio selection
  const handlePortfolioChange = (portfolioId: number) => {
    setSelectedPortfolioId(portfolioId);
    // Clear previous results when portfolio changes
    setStressTestResult(null);
    setMonteCarloResult(null);
  };

  // Handle stress test
  const handleRunStressTest = async (params: StressTestParams) => {
    setIsStressTestLoading(true);
    try {
      // TODO: Implement real stress test API endpoint
      console.log("Stress test params:", params);
      setStressTestResult(null);
    } catch (error) {
      handleError(error);
    } finally {
      setIsStressTestLoading(false);
    }
  };

  // Handle Monte Carlo simulation
  const handleRunMonteCarloSimulation = async (params: MonteCarloParams) => {
    setIsMonteCarloLoading(true);
    try {
      // TODO: Implement real Monte Carlo API endpoint
      console.log("Monte Carlo params:", params);
      setMonteCarloResult(null);
    } catch (error) {
      handleError(error);
    } finally {
      setIsMonteCarloLoading(false);
    }
  };

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
              {/* Portfolio Selector */}
              <BacktesterPortfolioSelector
                portfolios={portfolios}
                selectedPortfolioId={selectedPortfolioId}
                selectedPortfolio={selectedPortfolioData}
                onPortfolioChange={handlePortfolioChange}
                isLoading={portfolios.length === 0}
              />

              {/* Main Backtesting Interface */}
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as typeof activeTab)
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 h-12 bg-surface-primary rounded-lg p-1 shadow-sm">
                  <TabsTrigger
                    value="stresstest"
                    className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground hover:text-foreground transition-all"
                  >
                    <span className="hidden sm:inline">Stress Test</span>
                    <span className="sm:hidden">Stress Test</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="montecarlo"
                    className="text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground hover:text-foreground transition-all"
                  >
                    <span className="hidden sm:inline">
                      Monte Carlo Simulation
                    </span>
                    <span className="sm:hidden">Monte Carlo</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stresstest" className="mt-6">
                  <StressTest
                    portfolioId={selectedPortfolioId}
                    stressTestResult={stressTestResult}
                    isLoading={isStressTestLoading}
                    onRunStressTest={handleRunStressTest}
                  />
                </TabsContent>

                <TabsContent value="montecarlo" className="mt-6">
                  <MonteCarloSimulation
                    portfolioId={selectedPortfolioId}
                    monteCarloResult={monteCarloResult}
                    isLoading={isMonteCarloLoading}
                    onRunSimulation={handleRunMonteCarloSimulation}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
