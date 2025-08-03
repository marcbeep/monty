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
const VALID_TIMEFRAMES = ["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"];

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
      case "MAX":
        // For "Max", we'll use a very old date and let the stock API determine the actual range
        return new Date("1970-01-01");
      default:
        return new Date(now.getFullYear(), 0, 1); // Default to YTD
    }
  }

  private getTimeframeEndDate(): Date {
    return new Date(); // Always current date
  }

  private getTimeframeLabels(
    timeframe: string,
    startDate: Date
  ): {
    timeframeLabel: string;
    returnLabel: string;
    portfolioValueLabel: string;
    volatilityLabel: string;
    sortinoLabel: string;
  } {
    const now = new Date();
    const startYear = startDate.getFullYear();
    const currentYear = now.getFullYear();

    switch (timeframe.toUpperCase()) {
      case "1D":
        return {
          timeframeLabel: "1D Return",
          returnLabel: "Return over 1 day",
          portfolioValueLabel: "Portfolio value change over 1 day",
          volatilityLabel: "1D Volatility",
          sortinoLabel: "1D Sortino Ratio",
        };
      case "5D":
        return {
          timeframeLabel: "5D Return",
          returnLabel: "Return over 5 days",
          portfolioValueLabel: "Portfolio value change over 5 days",
          volatilityLabel: "5D Volatility",
          sortinoLabel: "5D Sortino Ratio",
        };
      case "1M":
        return {
          timeframeLabel: "1M Return",
          returnLabel: "Return over 1 month",
          portfolioValueLabel: "Portfolio value change over 1 month",
          volatilityLabel: "1M Volatility",
          sortinoLabel: "1M Sortino Ratio",
        };
      case "6M":
        return {
          timeframeLabel: "6M Return",
          returnLabel: "Return over 6 months",
          portfolioValueLabel: "Portfolio value change over 6 months",
          volatilityLabel: "6M Volatility",
          sortinoLabel: "6M Sortino Ratio",
        };
      case "YTD":
        return {
          timeframeLabel: "YTD Return",
          returnLabel: `Return since Jan 1, ${currentYear}`,
          portfolioValueLabel: `Portfolio value change since Jan 1, ${currentYear}`,
          volatilityLabel: "YTD Volatility",
          sortinoLabel: "YTD Sortino Ratio",
        };
      case "1Y":
        return {
          timeframeLabel: "1Y Return",
          returnLabel: "Return over 1 year",
          portfolioValueLabel: "Portfolio value change over 1 year",
          volatilityLabel: "1Y Volatility",
          sortinoLabel: "1Y Sortino Ratio",
        };
      case "5Y":
        return {
          timeframeLabel: "5Y Return",
          returnLabel: "Return over 5 years",
          portfolioValueLabel: "Portfolio value change over 5 years",
          volatilityLabel: "5Y Volatility",
          sortinoLabel: "5Y Sortino Ratio",
        };
      case "MAX":
        return {
          timeframeLabel: "Total Return",
          returnLabel: `Return since ${startYear}`,
          portfolioValueLabel: `Portfolio value change since ${startYear}`,
          volatilityLabel: "Total Volatility",
          sortinoLabel: "Total Sortino Ratio",
        };
      default:
        return {
          timeframeLabel: "Return",
          returnLabel: "Return for selected period",
          portfolioValueLabel: "Portfolio value change for selected period",
          volatilityLabel: "Volatility",
          sortinoLabel: "Sortino Ratio",
        };
    }
  }

  private getMetricDescriptions(
    timeframe: string,
    totalReturn: number,
    volatility: number,
    sortinoRatio: number
  ): {
    portfolioValueDescription: string;
    volatilityDescription: string;
    sortinoDescription: string;
  } {
    // Portfolio value description - show actual dollar change (this is great as-is)
    const sign = totalReturn >= 0 ? "+" : "";
    const portfolioValueDescription = `${sign}$${Math.abs(
      totalReturn
    ).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} over ${this.getTimeframePeriodText(timeframe)}`;

    // Volatility description - provide actionable context beyond just "high/low"
    let volatilityDescription = "";
    const timeframeLower = timeframe.toLowerCase();

    if (timeframeLower.includes("d")) {
      // Daily timeframes
      if (volatility < 5) {
        volatilityDescription = "Stable daily movements";
      } else if (volatility > 15) {
        volatilityDescription = "Expect large daily swings";
      } else {
        volatilityDescription = "Moderate daily price changes";
      }
    } else if (timeframeLower.includes("m") || timeframeLower === "ytd") {
      // Monthly/YTD timeframes
      if (volatility < 8) {
        volatilityDescription = "Relatively steady performance";
      } else if (volatility > 20) {
        volatilityDescription = "Large price swings expected";
      } else {
        volatilityDescription = "Moderate price movements";
      }
    } else {
      // Yearly timeframes
      if (volatility < 12) {
        volatilityDescription = "Consistent long-term growth";
      } else if (volatility > 25) {
        volatilityDescription = "Major ups and downs likely";
      } else {
        volatilityDescription = "Normal market fluctuations";
      }
    }

    // Sortino ratio description - focus on what it means for risk/reward
    let sortinoDescription = "";
    if (sortinoRatio < 0) {
      sortinoDescription = "More downside than upside";
    } else if (sortinoRatio < 0.5) {
      sortinoDescription = "Risk not well compensated";
    } else if (sortinoRatio < 1.0) {
      sortinoDescription = "Returns barely justify risk";
    } else if (sortinoRatio < 1.5) {
      sortinoDescription = "Decent risk-reward balance";
    } else if (sortinoRatio < 2.0) {
      sortinoDescription = "Good downside protection";
    } else {
      sortinoDescription = "Excellent risk management";
    }

    return {
      portfolioValueDescription,
      volatilityDescription,
      sortinoDescription,
    };
  }

  private getTimeframePeriodText(timeframe: string): string {
    switch (timeframe.toUpperCase()) {
      case "1D":
        return "1 day";
      case "5D":
        return "5 days";
      case "1M":
        return "1 month";
      case "6M":
        return "6 months";
      case "YTD":
        return "YTD";
      case "1Y":
        return "1 year";
      case "5Y":
        return "5 years";
      case "MAX":
        return "all time";
      default:
        return "period";
    }
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
        portfolioResponse.assets,
        timeframeUpper
      );
      const chartData = await this.generateChartData(
        portfolioResponse.assets,
        startDate,
        timeframeUpper
      );
      const metrics = await this.generateMetrics(
        portfolio.type,
        allocations,
        startDate,
        endDate,
        timeframeUpper,
        chartData
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
        const allocations = await this.generateAllocations(
          portfolio.assets,
          "YTD"
        );
        const metrics = await this.generateMetrics(
          dashboardPortfolio.type,
          allocations,
          new Date(new Date().getFullYear(), 0, 1), // YTD for summary
          new Date(),
          "YTD"
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

  private async generateAllocations(
    assets: any[],
    timeframe: string = "YTD"
  ): Promise<Allocation[]> {
    const allocations: Allocation[] = [];

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      const baseAmount = (asset.allocation / 100) * BASE_AMOUNT;

      try {
        // Get current stock data and historical data in parallel
        const [stockData, historicalData] = await Promise.all([
          stockService.getStockBasic(asset.symbol),
          stockService.getStockHistory(asset.symbol, timeframe).catch(() => []),
        ]);

        if (historicalData.length === 0) {
          // Fallback to basic calculation if no historical data
          allocations.push({
            id: 100 + i,
            symbol: asset.symbol,
            name: stockData?.name || asset.name || `Asset ${asset.symbol}`,
            type: asset.type,
            allocationPercent: asset.allocation,
            baseAmount,
            currentValue: baseAmount,
            totalReturn: 0,
            totalReturnPercent: 0,
            dayChange: 0,
            dayChangePercent: 0,
          });
          continue;
        }

        // Get first and last prices from historical data
        const firstPrice = historicalData[0]?.close;
        const currentPrice = historicalData[historicalData.length - 1]?.close;

        // Get previous day price for day change calculation
        const previousPrice =
          historicalData.length > 1
            ? historicalData[historicalData.length - 2]?.close
            : firstPrice;

        if (firstPrice && currentPrice && firstPrice > 0) {
          // Calculate how many shares we could buy with our allocation on the first day
          const shares = baseAmount / firstPrice;

          // Calculate current value of those shares
          const currentValue = shares * currentPrice;
          const totalReturn = currentValue - baseAmount;
          const totalReturnPercent = (totalReturn / baseAmount) * 100;

          // Calculate day change based on actual price movement
          const dayChange = previousPrice
            ? shares * (currentPrice - previousPrice)
            : 0;
          const dayChangePercent = previousPrice
            ? ((currentPrice - previousPrice) / previousPrice) * 100
            : 0;

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
        } else {
          // Fallback if prices are invalid
          allocations.push({
            id: 100 + i,
            symbol: asset.symbol,
            name: stockData?.name || asset.name || `Asset ${asset.symbol}`,
            type: asset.type,
            allocationPercent: asset.allocation,
            baseAmount,
            currentValue: baseAmount,
            totalReturn: 0,
            totalReturnPercent: 0,
            dayChange: 0,
            dayChangePercent: 0,
          });
        }
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

  private async generateMetrics(
    portfolioType: "Conservative" | "Moderate" | "Aggressive",
    allocations: Allocation[],
    startDate: Date,
    endDate: Date,
    timeframe: string,
    portfolioHistoricalData?: ChartDataPoint[]
  ): Promise<PortfolioMetrics> {
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

    // Calculate actual risk metrics from historical data if available
    let volatility = 0;
    let sortinoRatio = 0;
    let maxDrawdown = 0;

    if (portfolioHistoricalData && portfolioHistoricalData.length > 1) {
      // Calculate daily returns
      const dailyReturns: number[] = [];
      for (let i = 1; i < portfolioHistoricalData.length; i++) {
        const prevPoint = portfolioHistoricalData[i - 1];
        const currentPoint = portfolioHistoricalData[i];
        if (prevPoint?.value && currentPoint?.value && prevPoint.value > 0) {
          const dailyReturn =
            (currentPoint.value - prevPoint.value) / prevPoint.value;
          dailyReturns.push(dailyReturn);
        }
      }

      if (dailyReturns.length > 0) {
        // Calculate volatility (standard deviation of returns)
        const meanReturn =
          dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
        const variance =
          dailyReturns.reduce(
            (sum, ret) => sum + Math.pow(ret - meanReturn, 2),
            0
          ) / dailyReturns.length;
        const dailyVolatility = Math.sqrt(variance);

        // Convert to percentage for the timeframe period (not annualized)
        volatility = dailyVolatility * Math.sqrt(dailyReturns.length) * 100;

        // Calculate Sortino ratio (return / downside deviation)
        const downsideReturns = dailyReturns.filter((ret) => ret < 0);
        if (downsideReturns.length > 0) {
          const downsideVariance =
            downsideReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) /
            downsideReturns.length;
          const downsideDeviation = Math.sqrt(downsideVariance);
          if (downsideDeviation > 0) {
            sortinoRatio =
              totalReturnPercent /
              100 /
              (downsideDeviation * Math.sqrt(dailyReturns.length));
          }
        }

        // Calculate maximum drawdown
        const firstPoint = portfolioHistoricalData[0];
        if (firstPoint?.value) {
          let peak = firstPoint.value;
          let maxDrawdownValue = 0;
          for (const point of portfolioHistoricalData) {
            if (point?.value) {
              if (point.value > peak) {
                peak = point.value;
              }
              const drawdown = (peak - point.value) / peak;
              if (drawdown > maxDrawdownValue) {
                maxDrawdownValue = drawdown;
              }
            }
          }
          maxDrawdown = -maxDrawdownValue * 100; // Convert to negative percentage
        }
      }
    }

    // Fallback to static metrics if no historical data available
    if (volatility === 0 || sortinoRatio === 0) {
      const riskMetrics = RISK_METRICS[portfolioType];
      if (riskMetrics) {
        volatility = volatility || riskMetrics.volatility;
        sortinoRatio = sortinoRatio || riskMetrics.sortinoRatio;
        maxDrawdown = maxDrawdown || riskMetrics.maxDrawdown;
      }
    }

    // Calculate day change
    const dayChange = allocations.reduce(
      (sum, allocation) => sum + allocation.dayChange,
      0
    );
    const dayChangePercent =
      currentValue > 0 ? (dayChange / (currentValue - dayChange)) * 100 : 0;

    // Generate timeframe-specific labels
    const timeframeLabels = this.getTimeframeLabels(timeframe, startDate);

    // Generate helpful metric descriptions based on actual values
    const metricDescriptions = this.getMetricDescriptions(
      timeframe,
      totalReturn,
      volatility,
      sortinoRatio
    );

    return {
      baseAmount: BASE_AMOUNT,
      currentValue,
      totalReturn,
      totalReturnPercent,
      annualizedReturn,
      annualizedReturnPercent,
      volatility,
      sortinoRatio,
      maxDrawdown,
      dayChange,
      dayChangePercent,
      startDate: startDate.toISOString().substring(0, 10),
      lastUpdated: new Date().toISOString(),
      timeframe,
      timeframeLabel: timeframeLabels.timeframeLabel,
      returnLabel: timeframeLabels.returnLabel,
      portfolioValueLabel: timeframeLabels.portfolioValueLabel,
      volatilityLabel: timeframeLabels.volatilityLabel,
      sortinoLabel: timeframeLabels.sortinoLabel,
      portfolioValueDescription: metricDescriptions.portfolioValueDescription,
      volatilityDescription: metricDescriptions.volatilityDescription,
      sortinoDescription: metricDescriptions.sortinoDescription,
    };
  }

  private async generateChartData(
    assets: any[],
    startDate: Date,
    timeframe: string
  ): Promise<ChartDataPoint[]> {
    try {
      // Fetch historical data for all assets in parallel
      const assetHistoryPromises = assets.map(async (asset) => {
        try {
          const history = await stockService.getStockHistory(
            asset.symbol,
            timeframe
          );
          return {
            symbol: asset.symbol,
            allocation: asset.allocation,
            history: history,
          };
        } catch (error) {
          console.warn(`Failed to fetch history for ${asset.symbol}:`, error);
          return {
            symbol: asset.symbol,
            allocation: asset.allocation,
            history: [],
          };
        }
      });

      const assetsWithHistory = await Promise.all(assetHistoryPromises);

      // Filter out assets with no data
      const validAssets = assetsWithHistory.filter(
        (asset) => asset.history.length > 0
      );

      if (validAssets.length === 0) {
        // Fallback to starting value if no historical data available
        return [
          {
            date: startDate.toISOString().substring(0, 10),
            value: BASE_AMOUNT,
            timestamp: startDate.getTime(),
          },
        ];
      }

      // Create a map of all unique dates across all assets
      const allDates = new Set<string>();
      validAssets.forEach((asset) => {
        asset.history.forEach((point) => allDates.add(point.date));
      });

      // Sort dates chronologically
      const sortedDates = Array.from(allDates).sort();

      // Calculate portfolio value for each date
      const portfolioValues: ChartDataPoint[] = [];

      for (const date of sortedDates) {
        let totalPortfolioValue = 0;
        let hasValidData = false;

        for (const asset of validAssets) {
          // Find the price for this asset on this date
          const pricePoint = asset.history.find((point) => point.date === date);

          if (pricePoint) {
            // Get the first available price for this asset to calculate initial shares
            const firstPrice = asset.history[0]?.close;

            if (firstPrice && firstPrice > 0) {
              // Calculate how many shares we could buy with our allocation on day 1
              const allocatedAmount = (asset.allocation / 100) * BASE_AMOUNT;
              const shares = allocatedAmount / firstPrice;

              // Calculate current value of those shares
              const currentValue = shares * pricePoint.close;
              totalPortfolioValue += currentValue;
              hasValidData = true;
            }
          }
        }

        // Only add the data point if we have valid data for at least one asset
        if (hasValidData) {
          portfolioValues.push({
            date: date,
            value: Math.round(totalPortfolioValue * 100) / 100,
            timestamp: new Date(date).getTime(),
          });
        }
      }

      // Sort by date to ensure chronological order
      portfolioValues.sort((a, b) => a.timestamp - b.timestamp);

      return portfolioValues.length > 0
        ? portfolioValues
        : [
            {
              date: startDate.toISOString().substring(0, 10),
              value: BASE_AMOUNT,
              timestamp: startDate.getTime(),
            },
          ];
    } catch (error) {
      console.error("Error generating chart data:", error);
      // Fallback to starting value
      return [
        {
          date: startDate.toISOString().substring(0, 10),
          value: BASE_AMOUNT,
          timestamp: startDate.getTime(),
        },
      ];
    }
  }
}

export const dashboardService = new DashboardService();
