// Mock data for Monty dashboard - Portfolio Allocation Simulator
// Simulates portfolio performance from $10K base amount starting YTD

// Standardized asset types for consistent UI
export type AssetType =
  | "Bonds"
  | "Stocks"
  | "Cash"
  | "Growth"
  | "International"
  | "Crypto";

export interface Allocation {
  id: number;
  symbol: string;
  name: string;
  type: AssetType;
  allocationPercent: number; // e.g., 60 for 60%
  baseAmount: number; // Dollar amount allocated from $10K base
  currentValue: number; // Current dollar value of this allocation
  totalReturn: number; // Total return in dollars since start
  totalReturnPercent: number; // Total return percentage since start
  dayChange: number; // Change in dollars today
  dayChangePercent: number; // Change percentage today
}

export interface PortfolioMetrics {
  baseAmount: number; // Always $10,000
  currentValue: number; // Current total portfolio value
  totalReturn: number; // Total gain/loss in dollars
  totalReturnPercent: number; // Total return percentage
  ytdReturn: number; // Year-to-date return in dollars
  ytdReturnPercent: number; // Year-to-date return percentage
  dayChange: number; // Today's change in dollars
  dayChangePercent: number; // Today's change percentage
  maxDrawdown: number; // Maximum peak-to-trough decline percentage
  volatility: number; // Portfolio volatility (standard deviation)
  sharpeRatio: number; // Risk-adjusted return ratio
  startDate: string; // Portfolio simulation start date
  lastUpdated: string;
}

export interface ChartDataPoint {
  date: string;
  value: number; // Portfolio value on this date
  timestamp: number;
}

export interface Portfolio {
  id: number;
  name: string;
  type: "Conservative" | "Moderate" | "Aggressive";
  description: string;
  strategy: AssetAllocation[]; // Changed to structured allocation array
  riskLevel: "Low" | "Medium" | "High";
  lastUpdated: string;
}

// Structured asset allocation for visual representation
export interface AssetAllocation {
  type: AssetType;
  percentage: number;
  color: string; // Hex color for consistent theming
}

export interface DashboardData {
  portfolio: Portfolio;
  metrics: PortfolioMetrics;
  chartData: ChartDataPoint[];
  allocations: Allocation[]; // Changed from holdings to allocations
  timeframe: string;
}

// Portfolio strategy configurations with standardized allocations
const portfolios: Portfolio[] = [
  {
    id: 1,
    name: "Conservative Portfolio",
    type: "Conservative",
    description: "Capital preservation with steady income generation",
    strategy: [
      { type: "Bonds", percentage: 70, color: "#3b82f6" },
      { type: "Stocks", percentage: 25, color: "#10b981" },
      { type: "Cash", percentage: 5, color: "#6b7280" },
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
      { type: "Stocks", percentage: 60, color: "#10b981" },
      { type: "Bonds", percentage: 35, color: "#3b82f6" },
      { type: "Cash", percentage: 5, color: "#6b7280" },
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
      { type: "Growth", percentage: 80, color: "#8b5cf6" },
      { type: "International", percentage: 15, color: "#f59e0b" },
      { type: "Crypto", percentage: 5, color: "#ef4444" },
    ],
    riskLevel: "High",
    lastUpdated: "2024-01-15T16:00:00Z",
  },
];

// Base simulation parameters
const BASE_AMOUNT = 10000; // $10,000 starting amount
const YTD_START_DATE = "2024-01-01"; // Year-to-date start

// Mock allocation strategies for each portfolio type (updated with standardized types)
const mockAllocations = {
  1: [
    // Conservative Portfolio - 70% Bonds, 25% Stocks, 5% Cash
    {
      id: 101,
      symbol: "BND",
      name: "Vanguard Total Bond Market ETF",
      type: "Bonds" as AssetType,
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
      type: "Stocks" as AssetType,
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
    // Moderate Portfolio - 60% Stocks, 35% Bonds, 5% Cash
    {
      id: 201,
      symbol: "VTI",
      name: "Vanguard Total Stock Market ETF",
      type: "Stocks" as AssetType,
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
      type: "Bonds" as AssetType,
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
    // Aggressive Portfolio - 80% Growth, 15% International, 5% Crypto
    {
      id: 301,
      symbol: "QQQ",
      name: "Invesco QQQ Trust (NASDAQ-100)",
      type: "Growth" as AssetType,
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
      symbol: "VXUS",
      name: "Vanguard Total International Stock ETF",
      type: "International" as AssetType,
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
      symbol: "BTC-USD",
      name: "Bitcoin Allocation",
      type: "Crypto" as AssetType,
      allocationPercent: 5,
      baseAmount: 500,
      currentValue: 635.0,
      totalReturn: 135.0,
      totalReturnPercent: 27.0,
      dayChange: -12.7,
      dayChangePercent: -1.96,
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

  // Portfolio-specific risk metrics
  const riskMetrics = {
    1: { maxDrawdown: -3.2, volatility: 6.1, sharpeRatio: 1.25 }, // Conservative
    2: { maxDrawdown: -8.7, volatility: 12.3, sharpeRatio: 1.15 }, // Moderate
    3: { maxDrawdown: -18.5, volatility: 20.1, sharpeRatio: 0.95 }, // Aggressive
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
    ytdReturn: totalReturn, // Same as total return since we start YTD
    ytdReturnPercent: totalReturnPercent,
    dayChange,
    dayChangePercent,
    maxDrawdown: metrics.maxDrawdown,
    volatility: metrics.volatility,
    sharpeRatio: metrics.sharpeRatio,
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
