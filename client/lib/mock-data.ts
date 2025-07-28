// Mock data for Monty dashboard - Portfolio Allocation Simulator
// Simulates portfolio performance from $10K base amount starting YTD

import type {
  AssetType,
  Asset,
  Portfolio,
  ChartDataPoint,
  PortfolioMetrics,
  DashboardData,
} from "@/types";

import type {
  BacktestData,
  BacktestParams,
  ScenarioEvent,
  ScenarioResult,
  MonteCarloParams,
  MonteCarloResult,
  DrawdownDataPoint,
} from "@/types/backtester";

// Re-export for backward compatibility
export type { AssetType } from "@/types";

// Re-export types for backward compatibility
export type {
  PortfolioMetrics,
  ChartDataPoint,
  Portfolio,
  DashboardData,
} from "@/types";

// Portfolio strategy configurations with simplified allocations - Green monochrome palette
const portfolios: Portfolio[] = [
  {
    id: 1,
    name: "Conservative Portfolio",
    type: "Conservative",
    description: "Capital preservation with steady income generation",
    strategy: [
      { type: "Fixed Income", percentage: 70, color: "#22c55e" }, // green-500
      { type: "Equities", percentage: 25, color: "#15803d" }, // green-700
      { type: "Cash", percentage: 5, color: "#84cc16" }, // lime-500
    ],
    riskLevel: "Low",
    lastUpdated: "2024-01-15T16:00:00Z",
  },
  {
    id: 2,
    name: "Moderate Portfolio",
    type: "Moderate",
    description: "Balanced growth with moderate risk tolerance",
    strategy: [
      { type: "Equities", percentage: 60, color: "#16a34a" }, // green-600
      { type: "Fixed Income", percentage: 35, color: "#22c55e" }, // green-500
      { type: "Cash", percentage: 5, color: "#84cc16" }, // lime-500
    ],
    riskLevel: "Medium",
    lastUpdated: "2024-01-15T16:00:00Z",
  },
  {
    id: 3,
    name: "Aggressive Portfolio",
    type: "Aggressive",
    description: "Maximum growth potential with higher volatility",
    strategy: [
      { type: "Equities", percentage: 80, color: "#15803d" }, // green-700
      { type: "Alternatives", percentage: 15, color: "#166534" }, // green-800
      { type: "Cash", percentage: 5, color: "#84cc16" }, // lime-500
    ],
    riskLevel: "High",
    lastUpdated: "2024-01-15T16:00:00Z",
  },
];

// Base simulation parameters
const BASE_AMOUNT = 10000; // $10,000 starting amount
const YTD_START_DATE = "2024-01-01"; // Year-to-date start

// Mock allocation strategies for each portfolio type (updated with simplified types)
const MOCK_ALLOCATIONS = {
  1: [
    // Conservative Portfolio - 70% Fixed Income, 25% Equities, 5% Cash
    {
      id: 101,
      symbol: "BND",
      name: "Vanguard Total Bond Market ETF",
      type: "Fixed Income" as AssetType,
      allocationPercent: 70,
      baseAmount: 7000,
      currentValue: 7105.5,
      totalReturn: 105.5,
      totalReturnPercent: 1.51,
      dayChange: 2.8,
      dayChangePercent: 0.04,
    },
    {
      id: 102,
      symbol: "VTI",
      name: "Vanguard Total Stock Market ETF",
      type: "Equities" as AssetType,
      allocationPercent: 25,
      baseAmount: 2500,
      currentValue: 2890.25,
      totalReturn: 390.25,
      totalReturnPercent: 15.61,
      dayChange: 12.45,
      dayChangePercent: 0.43,
    },
    {
      id: 103,
      symbol: "CASH",
      name: "Cash Reserves",
      type: "Cash" as AssetType,
      allocationPercent: 5,
      baseAmount: 500,
      currentValue: 520.15,
      totalReturn: 20.15,
      totalReturnPercent: 4.03,
      dayChange: 0.12,
      dayChangePercent: 0.02,
    },
  ],
  2: [
    // Moderate Portfolio - 60% Equities, 35% Fixed Income, 5% Cash
    {
      id: 201,
      symbol: "VTI",
      name: "Vanguard Total Stock Market ETF",
      type: "Equities" as AssetType,
      allocationPercent: 60,
      baseAmount: 6000,
      currentValue: 6936.6,
      totalReturn: 936.6,
      totalReturnPercent: 15.61,
      dayChange: 29.88,
      dayChangePercent: 0.43,
    },
    {
      id: 202,
      symbol: "BND",
      name: "Vanguard Total Bond Market ETF",
      type: "Fixed Income" as AssetType,
      allocationPercent: 35,
      baseAmount: 3500,
      currentValue: 3552.75,
      totalReturn: 52.75,
      totalReturnPercent: 1.51,
      dayChange: 1.4,
      dayChangePercent: 0.04,
    },
    {
      id: 203,
      symbol: "CASH",
      name: "Cash Reserves",
      type: "Cash" as AssetType,
      allocationPercent: 5,
      baseAmount: 500,
      currentValue: 520.15,
      totalReturn: 20.15,
      totalReturnPercent: 4.03,
      dayChange: 0.12,
      dayChangePercent: 0.02,
    },
  ],
  3: [
    // Aggressive Portfolio - 80% Equities, 15% Alternatives, 5% Cash
    {
      id: 301,
      symbol: "QQQ",
      name: "Invesco QQQ Trust (NASDAQ-100)",
      type: "Equities" as AssetType,
      allocationPercent: 80,
      baseAmount: 8000,
      currentValue: 9440.0,
      totalReturn: 1440.0,
      totalReturnPercent: 18.0,
      dayChange: 47.2,
      dayChangePercent: 0.5,
    },
    {
      id: 302,
      symbol: "REIT",
      name: "Real Estate Investment Trust",
      type: "Alternatives" as AssetType,
      allocationPercent: 15,
      baseAmount: 1500,
      currentValue: 1665.0,
      totalReturn: 165.0,
      totalReturnPercent: 11.0,
      dayChange: 8.33,
      dayChangePercent: 0.5,
    },
    {
      id: 303,
      symbol: "CASH",
      name: "Cash Reserves",
      type: "Cash" as AssetType,
      allocationPercent: 5,
      baseAmount: 500,
      currentValue: 520.15,
      totalReturn: 20.15,
      totalReturnPercent: 4.03,
      dayChange: 0.12,
      dayChangePercent: 0.02,
    },
  ],
};

// Generate chart data for portfolio value evolution from $10K base
function generateChartData(
  portfolioId: number,
  timeframe: string
): ChartDataPoint[] {
  const baseValue = BASE_AMOUNT;

  // Portfolio-specific performance characteristics
  const portfolioParams = {
    1: { avgReturn: 0.045, volatility: 0.06 }, // Conservative: 4.5% return, 6% volatility
    2: { avgReturn: 0.08, volatility: 0.12 }, // Moderate: 8% return, 12% volatility
    3: { avgReturn: 0.15, volatility: 0.2 }, // Aggressive: 15% return, 20% volatility
  };

  const params = portfolioParams[portfolioId as keyof typeof portfolioParams];

  const periods = {
    "1D": 1,
    "1W": 7,
    "1M": 30,
    "3M": 90,
    "6M": 180,
    YTD: getDaysFromYTD(),
    "1Y": 365,
  };

  const days = periods[timeframe as keyof typeof periods] || getDaysFromYTD();
  const data: ChartDataPoint[] = [];

  // Start from YTD beginning or timeframe start
  const startDate = timeframe === "YTD" ? new Date(YTD_START_DATE) : new Date();
  if (timeframe !== "YTD") {
    startDate.setDate(startDate.getDate() - days);
  }

  let currentValue = baseValue;

  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    if (i === 0) {
      // First day starts at base amount
      currentValue = baseValue;
    } else {
      // Simulate daily returns
      const dailyReturn =
        params.avgReturn / 365 +
        (Math.random() - 0.5) * (params.volatility / Math.sqrt(365));
      currentValue *= 1 + dailyReturn;
    }

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(currentValue * 100) / 100,
      timestamp: date.getTime(),
    });
  }

  return data;
}

// Helper function to get days since YTD start
function getDaysFromYTD(): number {
  const start = new Date(YTD_START_DATE);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Generate portfolio metrics from allocations
function generateMetrics(portfolioId: number): PortfolioMetrics {
  const allocations =
    MOCK_ALLOCATIONS[portfolioId as keyof typeof MOCK_ALLOCATIONS] || [];
  const currentValue = allocations.reduce(
    (sum, allocation) => sum + allocation.currentValue,
    0
  );
  const totalReturn = currentValue - BASE_AMOUNT;
  const totalReturnPercent = (totalReturn / BASE_AMOUNT) * 100;

  // Calculate days since start for annualization
  const daysSinceStart = getDaysFromYTD();
  const yearFraction = daysSinceStart / 365;

  // Calculate annualized metrics (better for backtesting)
  const annualizedReturnPercent =
    yearFraction > 0
      ? Math.pow(1 + totalReturnPercent / 100, 1 / yearFraction) - 1
      : 0;
  const annualizedReturn = BASE_AMOUNT * annualizedReturnPercent;

  // Portfolio-specific risk metrics (updated with better backtesting metrics)
  const riskMetrics = {
    1: { maxDrawdown: -3.2, volatility: 6.1, sortinoRatio: 1.85 }, // Conservative: Lower volatility, higher Sortino
    2: { maxDrawdown: -8.7, volatility: 12.3, sortinoRatio: 1.42 }, // Moderate: Balanced risk-return
    3: { maxDrawdown: -18.5, volatility: 20.1, sortinoRatio: 1.15 }, // Aggressive: Higher volatility, lower Sortino
  };

  const metrics = riskMetrics[portfolioId as keyof typeof riskMetrics];

  // Calculate day change
  const dayChange = allocations.reduce(
    (sum, allocation) => sum + allocation.dayChange,
    0
  );
  const dayChangePercent = (dayChange / (currentValue - dayChange)) * 100;

  return {
    baseAmount: BASE_AMOUNT,
    currentValue,
    totalReturn,
    totalReturnPercent,
    annualizedReturn,
    annualizedReturnPercent: annualizedReturnPercent * 100, // Convert to percentage
    volatility: metrics.volatility,
    sortinoRatio: metrics.sortinoRatio,
    maxDrawdown: metrics.maxDrawdown,
    dayChange,
    dayChangePercent,
    startDate: YTD_START_DATE,
    lastUpdated: "2024-12-15T16:00:00Z",
  };
}

// Main function to get dashboard data
export function getMockDashboardData(
  portfolioId: number,
  timeframe: string = "YTD"
): DashboardData {
  const portfolio =
    portfolios.find((p) => p.id === portfolioId) || portfolios[0];
  const allocations =
    MOCK_ALLOCATIONS[portfolioId as keyof typeof MOCK_ALLOCATIONS] ||
    MOCK_ALLOCATIONS[1];
  const metrics = generateMetrics(portfolioId);
  const chartData = generateChartData(portfolioId, timeframe);

  return {
    portfolio,
    metrics,
    chartData,
    allocations,
    timeframe,
  };
}

// Export portfolios list
export function getMockPortfolios(): Portfolio[] {
  return portfolios;
}

// Available assets for portfolio building
export function getMockAvailableAssets(): Asset[] {
  return [
    {
      symbol: "VTI",
      name: "Vanguard Total Stock Market ETF",
      type: "Equities",
    },
    {
      symbol: "VXUS",
      name: "Vanguard Total International Stock ETF",
      type: "Equities",
    },
    {
      symbol: "BND",
      name: "Vanguard Total Bond Market ETF",
      type: "Fixed Income",
    },
    {
      symbol: "BNDX",
      name: "Vanguard Total International Bond ETF",
      type: "Fixed Income",
    },
    {
      symbol: "VNQ",
      name: "Vanguard Real Estate Index Fund ETF",
      type: "Alternatives",
    },
    {
      symbol: "IAU",
      name: "iShares Gold Trust",
      type: "Alternatives",
    },
    {
      symbol: "VMOT",
      name: "Vanguard Short-Term Inflation-Protected Securities ETF",
      type: "Fixed Income",
    },
    { symbol: "CASH", name: "Cash Reserves", type: "Cash" },
  ];
}

// Simulate API delay
export function mockApiCall<T>(data: T, delay: number = 800): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

// Backtester mock functions
export function getMockScenarios(): ScenarioEvent[] {
  return [
    {
      id: "covid-19",
      name: "COVID-19 Market Crash",
      description:
        "Simulate portfolio performance during the 2020 COVID-19 market crash",
      startDate: "2020-02-19",
      endDate: "2020-03-23",
      marketConditions:
        "Global pandemic causing market panic and economic shutdown",
      severity: "Extreme",
    },
    {
      id: "financial-crisis",
      name: "2008 Financial Crisis",
      description:
        "Simulate portfolio performance during the 2008 financial crisis",
      startDate: "2008-09-01",
      endDate: "2009-03-09",
      marketConditions: "Banking system collapse and housing market crash",
      severity: "Extreme",
    },
    {
      id: "dot-com-bubble",
      name: "Dot-com Bubble Burst",
      description:
        "Simulate portfolio performance during the 2000-2002 tech bubble burst",
      startDate: "2000-03-10",
      endDate: "2002-10-09",
      marketConditions: "Technology stock bubble burst and economic recession",
      severity: "High",
    },
    {
      id: "inflation-shock",
      name: "Inflation Shock (2022)",
      description:
        "Simulate portfolio performance during the 2022 inflation surge",
      startDate: "2022-01-01",
      endDate: "2022-12-31",
      marketConditions: "Rapid inflation and aggressive Fed rate hikes",
      severity: "Medium",
    },
    {
      id: "energy-crisis",
      name: "Energy Crisis",
      description:
        "Simulate portfolio performance during an energy supply crisis",
      startDate: "2023-01-01",
      endDate: "2023-06-30",
      marketConditions: "Energy supply disruptions and price volatility",
      severity: "Medium",
    },
  ];
}

export function getMockBacktestData(params: BacktestParams): BacktestData {
  const portfolio =
    portfolios.find((p) => p.id === params.portfolioId) || portfolios[0];
  const metrics = generateMetrics(params.portfolioId);
  const chartData = generateChartData(params.portfolioId, "1Y");

  // Generate drawdown data
  const drawdownData: DrawdownDataPoint[] = chartData.map((point, index) => {
    const peak = Math.max(...chartData.slice(0, index + 1).map((p) => p.value));
    const drawdown = ((point.value - peak) / peak) * 100;
    return {
      date: point.date,
      drawdown,
      peak,
      value: point.value,
    };
  });

  return {
    portfolio,
    startDate: params.startDate,
    endDate: params.endDate,
    metrics,
    chartData,
    drawdownData,
  };
}

export function getMockScenarioResult(
  portfolioId: number,
  scenarioId: string
): ScenarioResult {
  const portfolio =
    portfolios.find((p) => p.id === portfolioId) || portfolios[0];
  const scenario = getMockScenarios().find((s) => s.id === scenarioId);

  if (!scenario) {
    throw new Error(`Scenario ${scenarioId} not found`);
  }

  // Generate before, during, and after metrics
  const beforeMetrics = generateMetrics(portfolioId);
  const duringMetrics = {
    ...beforeMetrics,
    currentValue: beforeMetrics.currentValue * 0.85, // 15% decline during crisis
    totalReturn: beforeMetrics.totalReturn * 0.85,
    totalReturnPercent: beforeMetrics.totalReturnPercent * 0.85,
    maxDrawdown: -15,
  };
  const afterMetrics = {
    ...beforeMetrics,
    currentValue: beforeMetrics.currentValue * 1.05, // 5% recovery
    totalReturn: beforeMetrics.totalReturn * 1.05,
    totalReturnPercent: beforeMetrics.totalReturnPercent * 1.05,
  };

  // Generate crisis chart data
  const crisisChartData: ChartDataPoint[] = [];
  const startDate = new Date(scenario.startDate);
  const endDate = new Date(scenario.endDate);
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let currentValue = beforeMetrics.currentValue;
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    if (i > 0) {
      // Simulate crisis decline
      const declineRate = -0.15 / days; // Gradual 15% decline over crisis period
      currentValue *= 1 + declineRate;
    }

    crisisChartData.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(currentValue * 100) / 100,
      timestamp: date.getTime(),
    });
  }

  return {
    scenario,
    portfolio,
    beforeMetrics,
    duringMetrics,
    afterMetrics,
    chartData: crisisChartData,
    recovery: {
      timeToRecover: 180, // 6 months to recover
      maxDrawdown: -15,
      recoveryDate: new Date(endDate.getTime() + 180 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
  };
}

export function getMockMonteCarloResult(
  params: MonteCarloParams
): MonteCarloResult {
  const portfolio =
    portfolios.find((p) => p.id === params.portfolioId) || portfolios[0];
  const baseValue = 10000;

  // Generate projection data for different percentiles
  const generateProjection = (percentile: number): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const startDate = new Date();

    for (let year = 0; year <= params.timeHorizon; year++) {
      const date = new Date(startDate);
      date.setFullYear(date.getFullYear() + year);

      // Simulate growth based on percentile
      const growthRate = 0.08 + (percentile - 50) * 0.002; // 8% base + percentile adjustment
      const value = baseValue * Math.pow(1 + growthRate, year);

      data.push({
        date: date.toISOString().split("T")[0],
        value: Math.round(value * 100) / 100,
        timestamp: date.getTime(),
      });
    }

    return data;
  };

  const projections = {
    percentile5: generateProjection(5),
    percentile25: generateProjection(25),
    percentile50: generateProjection(50),
    percentile75: generateProjection(75),
    percentile95: generateProjection(95),
  };

  // Generate final values for distribution
  const finalValues: number[] = [];
  for (let i = 0; i < params.simulations; i++) {
    const growthRate = 0.08 + (Math.random() - 0.5) * 0.2; // 8% ± 10%
    const finalValue = baseValue * Math.pow(1 + growthRate, params.timeHorizon);
    finalValues.push(Math.round(finalValue * 100) / 100);
  }

  finalValues.sort((a, b) => a - b);

  return {
    portfolio,
    params,
    projections,
    outcomes: {
      bestCase: finalValues[Math.floor(params.simulations * 0.95)],
      worstCase: finalValues[Math.floor(params.simulations * 0.05)],
      median: finalValues[Math.floor(params.simulations * 0.5)],
      probabilityOfProfit: 75, // 75% chance of positive returns
      probabilityOfDoubling: 35, // 35% chance of doubling investment
    },
    distributionData: {
      finalValues,
      returnDistribution: [
        { return: -20, probability: 5 },
        { return: -10, probability: 15 },
        { return: 0, probability: 25 },
        { return: 10, probability: 30 },
        { return: 20, probability: 20 },
        { return: 30, probability: 5 },
      ],
    },
  };
}
