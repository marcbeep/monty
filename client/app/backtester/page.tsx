"use client";

import * as React from "react";
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
import {
  getMockPortfolios,
  getMockBacktestData,
  getMockScenarios,
  getMockScenarioResult,
  getMockMonteCarloResult,
  mockApiCall,
} from "@/lib/mock-data";
import type {
  Portfolio,
  BacktestData,
  BacktestParams,
  ScenarioEvent,
  ScenarioResult,
  MonteCarloParams,
  MonteCarloResult,
} from "@/types";

export default function BacktesterPage() {
  // State management
  const [selectedPortfolioId, setSelectedPortfolioId] = React.useState<
    number | null
  >(null);
  const [portfolios, setPortfolios] = React.useState<Portfolio[]>([]);
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

  // Monte Carlo simulation state
  const [monteCarloResult, setMonteCarloResult] =
    React.useState<MonteCarloResult | null>(null);
  const [isMonteCarloLoading, setIsMonteCarloLoading] = React.useState(false);

  // Load initial data
  React.useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [portfolioList, scenarioList] = await Promise.all([
          mockApiCall(getMockPortfolios(), 300),
          mockApiCall(getMockScenarios(), 200),
        ]);
        setPortfolios(portfolioList);
        setScenarios(scenarioList);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };
    loadInitialData();
  }, []);

  // Handle portfolio selection
  const handlePortfolioChange = (portfolioId: number) => {
    setSelectedPortfolioId(portfolioId);
    // Clear previous results when portfolio changes
    setBacktestData(null);
    setScenarioResults([]);
    setMonteCarloResult(null);
  };

  // Handle historical backtest
  const handleRunBacktest = async (params: BacktestParams) => {
    setIsBacktestLoading(true);
    try {
      const data = await mockApiCall(getMockBacktestData(params), 1200);
      setBacktestData(data);
    } catch (error) {
      console.error("Failed to run backtest:", error);
    } finally {
      setIsBacktestLoading(false);
    }
  };

  // Handle scenario analysis
  const handleRunScenario = async (scenarioId: string) => {
    if (!selectedPortfolioId) return;

    setIsScenarioLoading(true);
    try {
      const result = await mockApiCall(
        getMockScenarioResult(selectedPortfolioId, scenarioId),
        1000
      );

      // Add to results, replacing existing result for same scenario
      setScenarioResults((prev) => {
        const filtered = prev.filter((r) => r.scenario.id !== scenarioId);
        return [...filtered, result];
      });
    } catch (error) {
      console.error("Failed to run scenario:", error);
    } finally {
      setIsScenarioLoading(false);
    }
  };

  // Handle Monte Carlo simulation
  const handleRunMonteCarloSimulation = async (params: MonteCarloParams) => {
    setIsMonteCarloLoading(true);
    try {
      const result = await mockApiCall(getMockMonteCarloResult(params), 1500);
      setMonteCarloResult(result);
    } catch (error) {
      console.error("Failed to run Monte Carlo simulation:", error);
    } finally {
      setIsMonteCarloLoading(false);
    }
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
            {/* Portfolio Selector */}
            <BacktesterPortfolioSelector
              portfolios={portfolios}
              selectedPortfolioId={selectedPortfolioId}
              onPortfolioChange={handlePortfolioChange}
              isLoading={portfolios.length === 0}
            />

            {/* Main Backtesting Interface */}
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as typeof activeTab)}
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
  );
}
