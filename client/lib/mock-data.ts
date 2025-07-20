// Mock data for Monty dashboard - Portfolio Allocation Simulator
// Simulates portfolio performance from $10K base amount starting YTD

// Import types from centralized location
import type {
  AssetType,
  Allocation,
  Portfolio,
  PortfolioMetrics,
  ChartDataPoint,
  DashboardData,
  BacktestData,
  BacktestParams,
  ScenarioEvent,
  ScenarioResult,
  MonteCarloParams,
  MonteCarloResult,
  DrawdownDataPoint,
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
const mockAllocations: Record<number, Allocation[]> = {
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
    mockAllocations[portfolioId as keyof typeof mockAllocations] || [];
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
    mockAllocations[portfolioId as keyof typeof mockAllocations] ||
    mockAllocations[1];
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

// Simulate API delay
export function mockApiCall<T>(data: T, delay: number = 800): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

// ==================== BACKTESTER MOCK DATA ====================

// Mock scenario events for scenario analysis
const mockScenarioEvents: ScenarioEvent[] = [
  {
    id: "financial-crisis-2008",
    name: "2008 Financial Crisis",
    description:
      "Global financial crisis triggered by subprime mortgage collapse",
    startDate: "2007-10-01",
    endDate: "2009-03-31",
    marketConditions: "Severe recession, bank failures",
    severity: "Extreme",
  },
  {
    id: "covid-19-crash",
    name: "COVID-19 Market Crash",
    description: "Pandemic-induced market crash and rapid recovery",
    startDate: "2020-02-01",
    endDate: "2020-11-30",
    marketConditions: "Pandemic lockdowns, volatility",
    severity: "High",
  },
  {
    id: "dotcom-bubble",
    name: "Dot-Com Bubble Burst",
    description: "Technology stock bubble burst in early 2000s",
    startDate: "2000-03-01",
    endDate: "2002-10-31",
    marketConditions: "Tech stock collapse",
    severity: "High",
  },
  {
    id: "brexit-vote",
    name: "Brexit Vote Uncertainty",
    description: "UK Brexit referendum and aftermath volatility",
    startDate: "2016-06-01",
    endDate: "2016-12-31",
    marketConditions: "Political uncertainty",
    severity: "Medium",
  },
];

// Generate mock backtest data
export function getMockBacktestData(params: BacktestParams): BacktestData {
  const portfolio =
    portfolios.find((p) => p.id === params.portfolioId) || portfolios[0];

  // Calculate days between dates
  const startDate = new Date(params.startDate);
  const endDate = new Date(params.endDate);
  const daysDiff = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Generate mock performance based on portfolio risk level
  const baseReturn =
    portfolio.riskLevel === "Low"
      ? 0.06
      : portfolio.riskLevel === "Medium"
      ? 0.08
      : 0.12;
  const volatility =
    portfolio.riskLevel === "Low"
      ? 8
      : portfolio.riskLevel === "Medium"
      ? 12
      : 18;

  const annualizedReturn = baseReturn * (daysDiff / 365);
  const totalReturn = BASE_AMOUNT * annualizedReturn;
  const currentValue = BASE_AMOUNT + totalReturn;
  const totalReturnPercent = (totalReturn / BASE_AMOUNT) * 100;
  const annualizedReturnPercent = (annualizedReturn / (daysDiff / 365)) * 100;

  // Generate chart data points
  const chartData: ChartDataPoint[] = [];
  const drawdownData: DrawdownDataPoint[] = [];
  let peak = BASE_AMOUNT;

  for (let i = 0; i <= daysDiff; i += 7) {
    // Weekly data points
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const progress = i / daysDiff;

    // Add some realistic volatility
    const randomFactor = 1 + (Math.random() - 0.5) * 0.1;
    const value = BASE_AMOUNT + totalReturn * progress * randomFactor;

    chartData.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(value * 100) / 100,
      timestamp: date.getTime(),
    });

    // Track drawdowns
    if (value > peak) peak = value;
    const drawdown = ((peak - value) / peak) * 100;

    drawdownData.push({
      date: date.toISOString().split("T")[0],
      drawdown: Math.round(drawdown * 100) / 100,
      peak: Math.round(peak * 100) / 100,
      value: Math.round(value * 100) / 100,
    });
  }

  const maxDrawdown = Math.max(...drawdownData.map((d) => d.drawdown));

  const metrics: PortfolioMetrics = {
    baseAmount: BASE_AMOUNT,
    currentValue,
    totalReturn,
    totalReturnPercent,
    annualizedReturn: totalReturn / (daysDiff / 365),
    annualizedReturnPercent,
    volatility,
    sortinoRatio: annualizedReturnPercent / (volatility * 0.7), // Simplified Sortino
    maxDrawdown,
    dayChange: currentValue * 0.001, // Mock day change
    dayChangePercent: 0.1,
    startDate: params.startDate,
    lastUpdated: new Date().toISOString(),
  };

  return {
    portfolio,
    startDate: params.startDate,
    endDate: params.endDate,
    metrics,
    chartData,
    drawdownData,
  };
}

// Generate mock scenario result
export function getMockScenarioResult(
  portfolioId: number,
  scenarioId: string
): ScenarioResult {
  const portfolio =
    portfolios.find((p) => p.id === portfolioId) || portfolios[0];
  const scenario =
    mockScenarioEvents.find((s) => s.id === scenarioId) ||
    mockScenarioEvents[0];

  // Create before, during, and after metrics based on scenario severity
  const severityImpact = {
    Low: { maxDrawdown: 8, recoveryDays: 90 },
    Medium: { maxDrawdown: 15, recoveryDays: 180 },
    High: { maxDrawdown: 25, recoveryDays: 365 },
    Extreme: { maxDrawdown: 40, recoveryDays: 730 },
  };

  const impact = severityImpact[scenario.severity];
  const riskMultiplier =
    portfolio.riskLevel === "Low"
      ? 0.7
      : portfolio.riskLevel === "Medium"
      ? 1.0
      : 1.3;
  const adjustedDrawdown = impact.maxDrawdown * riskMultiplier;

  // Before crisis metrics (positive performance)
  const beforeMetrics: PortfolioMetrics = {
    baseAmount: BASE_AMOUNT,
    currentValue: BASE_AMOUNT * 1.05,
    totalReturn: BASE_AMOUNT * 0.05,
    totalReturnPercent: 5,
    annualizedReturn: BASE_AMOUNT * 0.08,
    annualizedReturnPercent: 8,
    volatility: portfolio.riskLevel === "Low" ? 8 : 12,
    sortinoRatio: 1.2,
    maxDrawdown: 2,
    dayChange: 50,
    dayChangePercent: 0.5,
    startDate: scenario.startDate,
    lastUpdated: new Date().toISOString(),
  };

  // During crisis metrics (negative impact)
  const duringValue = BASE_AMOUNT * (1 - adjustedDrawdown / 100);
  const duringMetrics: PortfolioMetrics = {
    ...beforeMetrics,
    currentValue: duringValue,
    totalReturn: duringValue - BASE_AMOUNT,
    totalReturnPercent: -adjustedDrawdown,
    maxDrawdown: adjustedDrawdown,
  };

  // After recovery metrics (recovery + growth)
  const finalValue = BASE_AMOUNT * 1.15; // Assumes recovery + growth
  const afterMetrics: PortfolioMetrics = {
    ...beforeMetrics,
    currentValue: finalValue,
    totalReturn: finalValue - BASE_AMOUNT,
    totalReturnPercent: 15,
    annualizedReturnPercent: 12,
    maxDrawdown: adjustedDrawdown,
  };

  // Generate mock chart data
  const chartData: ChartDataPoint[] = [
    {
      date: scenario.startDate,
      value: beforeMetrics.currentValue,
      timestamp: new Date(scenario.startDate).getTime(),
    },
    {
      date: scenario.endDate,
      value: duringMetrics.currentValue,
      timestamp: new Date(scenario.endDate).getTime(),
    },
  ];

  return {
    scenario,
    portfolio,
    beforeMetrics,
    duringMetrics,
    afterMetrics,
    chartData,
    recovery: {
      timeToRecover: impact.recoveryDays,
      maxDrawdown: adjustedDrawdown,
      recoveryDate: new Date(
        Date.now() + impact.recoveryDays * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
    },
  };
}

// Generate mock Monte Carlo result
export function getMockMonteCarloResult(
  params: MonteCarloParams
): MonteCarloResult {
  const portfolio =
    portfolios.find((p) => p.id === params.portfolioId) || portfolios[0];

  // Base expected return based on portfolio risk level
  const expectedReturn =
    portfolio.riskLevel === "Low"
      ? 0.06
      : portfolio.riskLevel === "Medium"
      ? 0.08
      : 0.12;
  const volatility =
    portfolio.riskLevel === "Low"
      ? 0.08
      : portfolio.riskLevel === "Medium"
      ? 0.12
      : 0.18;

  // Calculate outcomes based on time horizon
  const compoundGrowth = Math.pow(1 + expectedReturn, params.timeHorizon);
  const median = BASE_AMOUNT * compoundGrowth;

  // Generate percentile outcomes with realistic variance
  const outcomes = {
    bestCase: median * 1.8, // 95th percentile
    worstCase: median * 0.4, // 5th percentile
    median,
    probabilityOfProfit:
      75 +
      (portfolio.riskLevel === "Low"
        ? 10
        : portfolio.riskLevel === "Medium"
        ? 0
        : -10),
    probabilityOfDoubling:
      portfolio.riskLevel === "Low"
        ? 35
        : portfolio.riskLevel === "Medium"
        ? 55
        : 70,
  };

  // Generate projection data points
  const generateProjection = (multiplier: number): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    for (let year = 0; year <= params.timeHorizon; year++) {
      const date = new Date();
      date.setFullYear(date.getFullYear() + year);
      const yearlyGrowth = Math.pow(1 + expectedReturn * multiplier, year);
      data.push({
        date: date.toISOString().split("T")[0],
        value: BASE_AMOUNT * yearlyGrowth,
        timestamp: date.getTime(),
      });
    }
    return data;
  };

  const projections = {
    percentile5: generateProjection(0.4),
    percentile25: generateProjection(0.7),
    percentile50: generateProjection(1.0),
    percentile75: generateProjection(1.3),
    percentile95: generateProjection(1.8),
  };

  // Generate distribution data
  const finalValues: number[] = [];
  const returnDistribution: { return: number; probability: number }[] = [];

  // Simulate some final values for histogram
  for (let i = 0; i < 1000; i++) {
    const randomReturn =
      expectedReturn + (Math.random() - 0.5) * volatility * 2;
    const finalValue =
      BASE_AMOUNT * Math.pow(1 + randomReturn, params.timeHorizon);
    finalValues.push(finalValue);
  }

  // Create return distribution buckets
  for (let returnRate = -0.5; returnRate <= 2.0; returnRate += 0.1) {
    const count = finalValues.filter((v) => {
      const actualReturn = (v / BASE_AMOUNT - 1) / params.timeHorizon;
      return actualReturn >= returnRate && actualReturn < returnRate + 0.1;
    }).length;

    returnDistribution.push({
      return: returnRate,
      probability: (count / finalValues.length) * 100,
    });
  }

  return {
    portfolio,
    params,
    projections,
    outcomes,
    distributionData: {
      finalValues,
      returnDistribution,
    },
  };
}

// Get available scenarios
export function getMockScenarios(): ScenarioEvent[] {
  return mockScenarioEvents;
}
