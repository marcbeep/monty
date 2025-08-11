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
import { portfolioApi } from "@/lib/portfolio-api";
import { scenarioApi } from "@/lib/scenario-api";
import { useErrorHandler } from "@/hooks/use-error-handler";
import type { PortfolioResponse } from "@/types";
import { LoaderScreen } from "@/components/shared/loader-screen";
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
    string | null
  >(null);
  const [portfolios, setPortfolios] = React.useState<PortfolioResponse[]>([]);
  const [selectedPortfolioData, setSelectedPortfolioData] =
    React.useState<PortfolioResponse | null>(null);
  const [activeTab, setActiveTab] = React.useState<"stresstest" | "montecarlo">(
    "stresstest"
  );
  const [hasInitialLoaded, setHasInitialLoaded] = React.useState(false);
  const [progress, setProgress] = React.useState(10);

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
        const portfolioList = await portfolioApi.getPortfolios();
        console.log("Backtester portfolios loaded:", portfolioList.length);
        setPortfolios(portfolioList);
        setProgress((p) => (p < 100 ? 100 : p));
      } catch (error) {
        handleError(error);
      }
    };
    loadInitialData();
  }, [handleError]);

  // Mark initial load complete when portfolios fetched or after timeout
  React.useEffect(() => {
    if (!hasInitialLoaded && portfolios.length > 0) {
      const t = setTimeout(() => setHasInitialLoaded(true), 200);
      return () => clearTimeout(t);
    }
  }, [hasInitialLoaded, portfolios.length]);

  // Safety timeout
  React.useEffect(() => {
    if (hasInitialLoaded) return;
    const timeout = setTimeout(() => setHasInitialLoaded(true), 10000);
    return () => clearTimeout(timeout);
  }, [hasInitialLoaded]);

  // Fetch full portfolio data when selected portfolio changes
  React.useEffect(() => {
    const fetchSelectedPortfolioData = async () => {
      if (!selectedPortfolioId) {
        setSelectedPortfolioData(null);
        return;
      }

      try {
        const portfolioData =
          await portfolioApi.getPortfolio(selectedPortfolioId);
        console.log("Selected portfolio data:", {
          id: portfolioData.id,
          name: portfolioData.name,
          assets: portfolioData.assets.length,
          totalAllocation: portfolioData.assets.reduce(
            (sum, a) => sum + a.allocation,
            0
          ),
        });
        setSelectedPortfolioData(portfolioData);
      } catch (error) {
        handleError(error);
        // Fallback to portfolios list
        const fallbackPortfolio = portfolios.find(
          (p) => p.id === selectedPortfolioId
        );
        setSelectedPortfolioData(fallbackPortfolio || null);
      }
    };

    fetchSelectedPortfolioData();
  }, [selectedPortfolioId, portfolios, handleError]);

  // Handle portfolio selection
  const handlePortfolioChange = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    // Clear previous results when portfolio changes
    setStressTestResult(null);
    setMonteCarloResult(null);
  };

  // Handle stress test
  const handleRunStressTest = async (params: StressTestParams) => {
    setIsStressTestLoading(true);
    try {
      const holdings =
        selectedPortfolioData?.assets.map((asset) => ({
          symbol: asset.symbol,
          allocation: asset.allocation,
          type: asset.type,
          name: asset.name,
        })) || [];

      console.log("Stress test params:", params);
      console.log("Portfolio holdings:", holdings);

      const result = await scenarioApi.runStressTest(
        params,
        holdings,
        portfolios
      );
      console.log("Stress test result:", result);
      setStressTestResult(result);
    } catch (error) {
      console.error("Stress test error:", error);
      handleError(error);
    } finally {
      setIsStressTestLoading(false);
    }
  };

  // Handle Monte Carlo simulation
  const handleRunMonteCarloSimulation = async (params: MonteCarloParams) => {
    setIsMonteCarloLoading(true);
    try {
      const holdings =
        selectedPortfolioData?.assets.map((asset) => ({
          symbol: asset.symbol,
          allocation: asset.allocation,
          type: asset.type,
          name: asset.name,
        })) || [];

      console.log("Monte Carlo params:", params);
      console.log("Portfolio holdings:", holdings);

      const result = await scenarioApi.runMonteCarlo(
        params,
        holdings,
        portfolios
      );
      console.log("Monte Carlo result:", result);
      setMonteCarloResult(result);
    } catch (error) {
      console.error("Monte Carlo error:", error);
      handleError(error);
    } finally {
      setIsMonteCarloLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      {!hasInitialLoaded && (
        <LoaderScreen
          title="Loading backtester"
          description="Preparing portfolios and tools..."
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
