"use client";

import * as React from "react";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { SiteHeader } from "@/components/shared/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BacktesterPortfolioSelector,
  HistoricalBacktest,
  ScenarioAnalysis,
  MonteCarloSimulation,
} from "./_components";
import { dashboardApi, transformSummaryToPortfolio } from "@/lib/dashboard-api";
import { useErrorHandler } from "@/hooks/use-error-handler";
import type { Portfolio } from "@/types";
import type {
  BacktestData,
  BacktestParams,
  ScenarioEvent,
  ScenarioResult,
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
  const [scenarios, setScenarios] = React.useState<ScenarioEvent[]>([]);
  const [activeTab, setActiveTab] = React.useState<
    "historical" | "scenarios" | "montecarlo"
  >("historical");

  // Historical backtesting state
  const [backtestData, setBacktestData] = React.useState<BacktestData | null>(
    null
  );
  const [isBacktestLoading, setIsBacktestLoading] = React.useState(false);

  // Scenario analysis state
  const [scenarioResults, setScenarioResults] = React.useState<
    ScenarioResult[]
  >([]);
  const [isScenarioLoading, setIsScenarioLoading] = React.useState(false);
  const [runningScenarioId, setRunningScenarioId] = React.useState<
    string | null
  >(null);

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

        // TODO: Replace with real scenario API
        setScenarios([]);
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
    setBacktestData(null);
    setScenarioResults([]);
    setMonteCarloResult(null);
    setRunningScenarioId(null);
  };

  // Handle historical backtest
  const handleRunBacktest = async (params: BacktestParams) => {
    setIsBacktestLoading(true);
    try {
      // TODO: Implement real backtest API endpoint
      console.log("Backtest params:", params);
      setBacktestData(null);
    } catch (error) {
      handleError(error);
    } finally {
      setIsBacktestLoading(false);
    }
  };

  // Handle scenario analysis
  const handleRunScenario = async (scenarioId: string) => {
    if (!selectedPortfolioId || isScenarioLoading) return;

    setIsScenarioLoading(true);
    setRunningScenarioId(scenarioId);
    // Clear previous results when starting a new scenario
    setScenarioResults([]);

    try {
      // TODO: Implement real scenario API endpoint
      console.log("Scenario params:", {
        portfolioId: selectedPortfolioId,
        scenarioId,
      });
      setScenarioResults([]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsScenarioLoading(false);
      setRunningScenarioId(null);
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
                <TabsList className="grid w-full grid-cols-3 h-auto">
                  <TabsTrigger
                    value="historical"
                    className="text-xs sm:text-sm px-2 py-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">
                      Historical Backtesting
                    </span>
                    <span className="sm:hidden">Historical</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="scenarios"
                    className="text-xs sm:text-sm px-2 py-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Scenario Analysis</span>
                    <span className="sm:hidden">Scenarios</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="montecarlo"
                    className="text-xs sm:text-sm px-2 py-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">
                      Monte Carlo Simulation
                    </span>
                    <span className="sm:hidden">Monte Carlo</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="historical" className="mt-6">
                  <HistoricalBacktest
                    portfolioId={selectedPortfolioId}
                    backtestData={backtestData}
                    isLoading={isBacktestLoading}
                    onRunBacktest={handleRunBacktest}
                  />
                </TabsContent>

                <TabsContent value="scenarios" className="mt-6">
                  <ScenarioAnalysis
                    portfolioId={selectedPortfolioId}
                    scenarios={scenarios}
                    scenarioResults={scenarioResults}
                    isLoading={isScenarioLoading}
                    runningScenarioId={runningScenarioId}
                    onRunScenario={handleRunScenario}
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
