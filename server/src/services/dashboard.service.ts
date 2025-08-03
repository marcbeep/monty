import { portfolioService } from "./portfolio.service";
import { stockService } from "./stock.service";
import {
  DashboardData,
  DashboardPortfolio,
  PortfolioMetrics,
  ChartDataPoint,
  Allocation,
  PortfolioSummary,
  AssetAllocation,
} from "../dto/dashboard.dto";
import { AppError } from "../utils/errors";

const BASE_AMOUNT = 10000; // $10,000 starting amount

// Valid timeframes matching our UI
const VALID_TIMEFRAMES = ["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "Max"];

// Asset type color mapping
const ASSET_COLORS: Record<string, string> = {
  Cash: "#10b981", // green-500
  Equities: "#3b82f6", // blue-500
  "Fixed Income": "#f59e0b", // amber-500
  Alternatives: "#8b5cf6", // violet-500
  Unassigned: "#6b7280", // gray-500
};

// Risk metrics by portfolio type
const RISK_METRICS = {
  Conservative: { maxDrawdown: -3.2, volatility: 6.1, sortinoRatio: 1.85 },
  Moderate: { maxDrawdown: -8.7, volatility: 12.3, sortinoRatio: 1.42 },
  Aggressive: { maxDrawdown: -18.5, volatility: 20.1, sortinoRatio: 1.15 },
};

export class DashboardService {
  private validateTimeframe(timeframe: string): void {
    const timeframeUpper = timeframe.toUpperCase();
    if (!VALID_TIMEFRAMES.includes(timeframeUpper)) {
      throw new AppError(
        `Invalid timeframe '${timeframe}'. Valid options: ${VALID_TIMEFRAMES.join(
          ", "
        )}`,
        400
      );
    }
  }

  private getTimeframeStartDate(timeframe: string): Date {
    const now = new Date();
    const timeframeUpper = timeframe.toUpperCase();

    switch (timeframeUpper) {
      case "1D":
        return new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      case "5D":
        return new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
      case "1M":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "6M":
        return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      case "YTD":
        return new Date(now.getFullYear(), 0, 1);
      case "1Y":
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      case "5Y":
        return new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
      case "Max":
        // For "Max", we'll use a very old date and let the stock API determine the actual range
        return new Date("1970-01-01");
      default:
        return new Date(now.getFullYear(), 0, 1); // Default to YTD
    }
  }

  private getTimeframeEndDate(): Date {
    return new Date(); // Always current date
  }

  async getDashboardData(
    userId: string,
    portfolioId: string,
    timeframe: string = "YTD"
  ): Promise<DashboardData> {
    try {
      // Validate timeframe
      this.validateTimeframe(timeframe);
      const timeframeUpper = timeframe.toUpperCase();

      // Handle both UUID and integer portfolio IDs
      let actualPortfolioId = portfolioId;

      // If portfolioId is a number, we need to find the actual UUID
      if (/^\d+$/.test(portfolioId)) {
        const userPortfolios = await portfolioService.getUserPortfolios(userId);
        const portfolioIndex = parseInt(portfolioId) - 1; // Convert to 0-based index

        if (portfolioIndex < 0 || portfolioIndex >= userPortfolios.length) {
          throw new AppError("Portfolio not found", 404);
        }

        const selectedPortfolio = userPortfolios[portfolioIndex];
        if (!selectedPortfolio) {
          throw new AppError("Portfolio not found", 404);
        }

        actualPortfolioId = selectedPortfolio.id;
      }

      // Get portfolio from database using actual UUID
      const portfolioResponse = await portfolioService.getPortfolioById(
        userId,
        actualPortfolioId
      );

      // Transform to dashboard format (use the integer ID passed from client)
      const displayId = /^\d+$/.test(portfolioId) ? parseInt(portfolioId) : 1;
      const portfolio = this.transformPortfolioToDashboard(
        portfolioResponse,
        displayId
      );

      // Calculate timeframe date range
      const startDate = this.getTimeframeStartDate(timeframeUpper);
      const endDate = this.getTimeframeEndDate();

      // Generate analytics data
      const allocations = await this.generateAllocations(
        portfolioResponse.assets
      );
      const metrics = this.generateMetrics(
        portfolio.type,
        allocations,
        startDate,
        endDate
      );
      const chartData = this.generateChartData(
        portfolio.type,
        startDate,
        endDate
      );

      return {
        portfolio,
        metrics,
        chartData,
        allocations,
        timeframe: timeframeUpper,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Failed to get dashboard data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async getUserPortfolios(userId: string): Promise<PortfolioSummary[]> {
    try {
      const portfolios = await portfolioService.getUserPortfolios(userId);

      const summaries: PortfolioSummary[] = [];

      for (let i = 0; i < portfolios.length; i++) {
        const portfolio = portfolios[i];
        if (!portfolio) continue; // Skip if portfolio is undefined

        const displayId = i + 1; // 1-based index
        const dashboardPortfolio = this.transformPortfolioToDashboard(
          portfolio,
          displayId
        );
        const allocations = await this.generateAllocations(portfolio.assets);
        const metrics = this.generateMetrics(
          dashboardPortfolio.type,
          allocations,
          new Date(new Date().getFullYear(), 0, 1), // YTD for summary
          new Date()
        );

        summaries.push({
          id: displayId,
          name: portfolio.name,
          type: dashboardPortfolio.type,
          riskLevel: portfolio.riskLevel,
          currentValue: metrics.currentValue,
          totalReturn: metrics.totalReturn,
          totalReturnPercent: metrics.totalReturnPercent,
          lastUpdated: portfolio.updatedAt,
        });
      }

      return summaries;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Failed to get user portfolios: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  private transformPortfolioToDashboard(
    portfolio: any,
    displayId?: number
  ): DashboardPortfolio {
    // Determine portfolio type based on asset allocation
    const equityAllocation = portfolio.assets
      .filter((asset: any) => asset.type === "Equities")
      .reduce((sum: number, asset: any) => sum + asset.allocation, 0);

    let type: "Conservative" | "Moderate" | "Aggressive";
    if (equityAllocation <= 35) {
      type = "Conservative";
    } else if (equityAllocation <= 70) {
      type = "Moderate";
    } else {
      type = "Aggressive";
    }

    // Generate strategy allocation summary
    const strategy: AssetAllocation[] = [];
    const assetTypeMap = new Map<string, number>();

    portfolio.assets.forEach((asset: any) => {
      const current = assetTypeMap.get(asset.type) || 0;
      assetTypeMap.set(asset.type, current + asset.allocation);
    });

    assetTypeMap.forEach((percentage, assetType) => {
      strategy.push({
        type: assetType,
        percentage,
        color:
          ASSET_COLORS[assetType] || ASSET_COLORS["Unassigned"] || "#6b7280",
      });
    });

    return {
      id: displayId || 1, // Use provided displayId or default to 1
      name: portfolio.name,
      type,
      description: portfolio.description || `${type} portfolio strategy`,
      strategy,
      riskLevel: portfolio.riskLevel,
      lastUpdated: portfolio.updatedAt,
    };
  }

  private async generateAllocations(assets: any[]): Promise<Allocation[]> {
    const allocations: Allocation[] = [];

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const baseAmount = (asset.allocation / 100) * BASE_AMOUNT;

      try {
        // Get current stock data
        const stockData = await stockService.getStockBasic(asset.symbol);

        // Simulate some performance (in real implementation, this would use historical data)
        const performanceMultiplier = 1 + (Math.random() * 0.4 - 0.1); // -10% to +30%
        const currentValue = baseAmount * performanceMultiplier;
        const totalReturn = currentValue - baseAmount;
        const totalReturnPercent = (totalReturn / baseAmount) * 100;

        // Simulate day change
        const dayChangeMultiplier = 1 + (Math.random() * 0.06 - 0.03); // -3% to +3%
        const dayChange = currentValue * (dayChangeMultiplier - 1);
        const dayChangePercent = (dayChangeMultiplier - 1) * 100;

        allocations.push({
          id: 100 + i,
          symbol: asset.symbol,
          name: stockData?.name || asset.name || `Asset ${asset.symbol}`,
          type: asset.type,
          allocationPercent: asset.allocation,
          baseAmount,
          currentValue,
          totalReturn,
          totalReturnPercent,
          dayChange,
          dayChangePercent,
        });
      } catch (error) {
        // Fallback if stock data unavailable
        const currentValue = baseAmount * 1.05; // 5% default gain
        allocations.push({
          id: 100 + i,
          symbol: asset.symbol,
          name: asset.name || `Asset ${asset.symbol}`,
          type: asset.type,
          allocationPercent: asset.allocation,
          baseAmount,
          currentValue,
          totalReturn: currentValue - baseAmount,
          totalReturnPercent: 5.0,
          dayChange: 0,
          dayChangePercent: 0,
        });
      }
    }

    return allocations;
  }

  private generateMetrics(
    portfolioType: "Conservative" | "Moderate" | "Aggressive",
    allocations: Allocation[],
    startDate: Date,
    endDate: Date
  ): PortfolioMetrics {
    const currentValue = allocations.reduce(
      (sum, allocation) => sum + allocation.currentValue,
      0
    );
    const totalReturn = currentValue - BASE_AMOUNT;
    const totalReturnPercent = (totalReturn / BASE_AMOUNT) * 100;

    // Calculate days since start for annualization
    const daysSinceStart = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const yearFraction = Math.max(daysSinceStart / 365, 1 / 365); // Minimum 1 day

    // Calculate annualized metrics
    const annualizedReturnPercent =
      yearFraction > 0
        ? (Math.pow(1 + totalReturnPercent / 100, 1 / yearFraction) - 1) * 100
        : 0;
    const annualizedReturn = BASE_AMOUNT * (annualizedReturnPercent / 100);

    // Get risk metrics for portfolio type
    const riskMetrics = RISK_METRICS[portfolioType];

    // Calculate day change
    const dayChange = allocations.reduce(
      (sum, allocation) => sum + allocation.dayChange,
      0
    );
    const dayChangePercent =
      currentValue > 0 ? (dayChange / (currentValue - dayChange)) * 100 : 0;

    return {
      baseAmount: BASE_AMOUNT,
      currentValue,
      totalReturn,
      totalReturnPercent,
      annualizedReturn,
      annualizedReturnPercent,
      volatility: riskMetrics.volatility,
      sortinoRatio: riskMetrics.sortinoRatio,
      maxDrawdown: riskMetrics.maxDrawdown,
      dayChange,
      dayChangePercent,
      startDate: startDate.toISOString().substring(0, 10),
      lastUpdated: new Date().toISOString(),
    };
  }

  private generateChartData(
    portfolioType: "Conservative" | "Moderate" | "Aggressive",
    startDate: Date,
    endDate: Date
  ): ChartDataPoint[] {
    // Simulate chart data based on portfolio type and actual timeframe
    const points: ChartDataPoint[] = [];

    const totalDays = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const interval = Math.max(1, Math.floor(totalDays / 50)); // ~50 data points

    // Performance multipliers by portfolio type
    const performanceFactors = {
      Conservative: 0.6,
      Moderate: 1.0,
      Aggressive: 1.4,
    };

    const factor = performanceFactors[portfolioType];
    let currentValue = BASE_AMOUNT;

    for (let i = 0; i <= totalDays; i += interval) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      // Simulate gradual growth with some volatility
      const randomWalk = (Math.random() - 0.5) * 0.02 * factor; // Daily volatility
      const trendGrowth = 0.0002 * factor; // Upward trend
      currentValue *= 1 + trendGrowth + randomWalk;

      points.push({
        date: date.toISOString().substring(0, 10),
        value: Math.round(currentValue * 100) / 100,
        timestamp: date.getTime(),
      });
    }

    return points;
  }
}

export const dashboardService = new DashboardService();
