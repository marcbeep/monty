import { stockApi, type HistoricalDataPoint } from "./stock-api";
import type { PortfolioResponse } from "@/types/portfolio";
import type {
  DashboardData,
  Portfolio,
  PortfolioMetrics,
  Allocation,
  ChartDataPoint,
} from "@/types";

const BASE_AMOUNT = 10000;

export class PortfolioCalculator {
  static async calculateDashboardData(
    portfolio: PortfolioResponse,
    timeframe: string
  ): Promise<DashboardData> {
    const historicalPromises = portfolio.assets.map((asset) =>
      stockApi.getHistory(asset.symbol, timeframe)
    );
    const historicalData = await Promise.all(historicalPromises);
    const startDate = this.findLatestStartDate(historicalData);
    const chartData = this.calculatePortfolioTimeSeries(
      portfolio.assets,
      historicalData,
      startDate
    );
    const metrics = this.calculateMetrics(chartData);
    const allocations = await this.getCurrentAllocations(portfolio.assets);

    return {
      portfolio: this.convertToLegacyPortfolio(portfolio),
      chartData,
      metrics,
      allocations,
      timeframe,
    };
  }

  private static findLatestStartDate(
    historicalData: HistoricalDataPoint[][]
  ): string {
    const startDates = historicalData
      .map((data) => data[0]?.date)
      .filter(Boolean)
      .sort();
    return startDates[startDates.length - 1];
  }

  private static calculatePortfolioTimeSeries(
    assets: PortfolioResponse["assets"],
    historicalData: HistoricalDataPoint[][],
    startDate: string
  ): ChartDataPoint[] {
    const allDates = new Set<string>();
    historicalData.forEach((data) => {
      data.forEach((point) => {
        if (point.date >= startDate) {
          allDates.add(point.date);
        }
      });
    });

    const sortedDates = Array.from(allDates).sort();
    const assetPriceMaps = historicalData.map((data) => {
      const priceMap = new Map<string, number>();
      data.forEach((point) => priceMap.set(point.date, point.close));
      return priceMap;
    });

    return sortedDates.map((date) => {
      let totalValue = 0;

      assets.forEach((asset, index) => {
        const price = assetPriceMaps[index].get(date);
        if (price) {
          const assetValue =
            (asset.allocation / 100) *
            BASE_AMOUNT *
            (price / this.getInitialPrice(assetPriceMaps[index], startDate));
          totalValue += assetValue;
        }
      });

      return {
        date,
        value: Math.round(totalValue * 100) / 100,
        timestamp: new Date(date).getTime(),
      };
    });
  }

  private static getInitialPrice(
    priceMap: Map<string, number>,
    startDate: string
  ): number {
    const price = priceMap.get(startDate);
    if (price) return price;

    const dates = Array.from(priceMap.keys()).sort();
    for (const date of dates) {
      if (date >= startDate) {
        return priceMap.get(date) || 1;
      }
    }
    return 1;
  }

  private static calculateMetrics(
    chartData: ChartDataPoint[]
  ): PortfolioMetrics {
    if (chartData.length === 0) {
      return this.getZeroMetrics();
    }

    const currentValue = chartData[chartData.length - 1].value;
    const totalReturn = currentValue - BASE_AMOUNT;
    const totalReturnPercent = (totalReturn / BASE_AMOUNT) * 100;

    const dailyReturns = [];
    for (let i = 1; i < chartData.length; i++) {
      const prevValue = chartData[i - 1].value;
      const currentValue = chartData[i].value;
      const dailyReturn = (currentValue - prevValue) / prevValue;
      dailyReturns.push(dailyReturn);
    }

    const volatility =
      this.calculateVolatility(dailyReturns) * Math.sqrt(252) * 100;
    const daysInPeriod = chartData.length;
    const yearFraction = daysInPeriod / 365;
    const annualizedReturnPercent =
      yearFraction > 0
        ? (Math.pow(currentValue / BASE_AMOUNT, 1 / yearFraction) - 1) * 100
        : 0;
    const annualizedReturn = BASE_AMOUNT * (annualizedReturnPercent / 100);
    const maxDrawdown = this.calculateMaxDrawdown(chartData);
    const sortinoRatio = this.calculateSortinoRatio(
      dailyReturns,
      annualizedReturnPercent
    );
    const dayChange =
      chartData.length >= 2
        ? chartData[chartData.length - 1].value -
          chartData[chartData.length - 2].value
        : 0;
    const dayChangePercent =
      chartData.length >= 2
        ? (dayChange / chartData[chartData.length - 2].value) * 100
        : 0;

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
      startDate: chartData[0]?.date || new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString(),
    };
  }

  private static calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0;

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance =
      returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
      returns.length;
    return Math.sqrt(variance);
  }

  private static calculateMaxDrawdown(chartData: ChartDataPoint[]): number {
    let peak = chartData[0]?.value || BASE_AMOUNT;
    let maxDrawdown = 0;

    for (const point of chartData) {
      if (point.value > peak) {
        peak = point.value;
      }
      const drawdown = ((point.value - peak) / peak) * 100;
      if (drawdown < maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    return maxDrawdown;
  }

  private static calculateSortinoRatio(
    returns: number[],
    annualizedReturn: number
  ): number {
    if (returns.length === 0) return 0;

    const downshideReturns = returns.filter((r) => r < 0);
    if (downshideReturns.length === 0) return 2.0;

    const downsideDeviation = this.calculateVolatility(downshideReturns);
    return downsideDeviation > 0
      ? annualizedReturn / 100 / (downsideDeviation * Math.sqrt(252))
      : 0;
  }

  private static async getCurrentAllocations(
    assets: PortfolioResponse["assets"]
  ): Promise<Allocation[]> {
    return assets.map((asset, index) => {
      const baseAmount = (asset.allocation / 100) * BASE_AMOUNT;
      const currentValue = baseAmount;

      return {
        id: index + 1,
        symbol: asset.symbol,
        name: asset.name,
        type: asset.type,
        allocationPercent: asset.allocation,
        baseAmount,
        currentValue,
        totalReturn: currentValue - baseAmount,
        totalReturnPercent: ((currentValue - baseAmount) / baseAmount) * 100,
        dayChange: 0,
        dayChangePercent: 0,
      };
    });
  }

  private static convertToLegacyPortfolio(
    portfolio: PortfolioResponse
  ): Portfolio {
    return {
      id: parseInt(portfolio.id) || 1,
      name: portfolio.name,
      type:
        portfolio.riskLevel === "Low"
          ? "Conservative"
          : portfolio.riskLevel === "High"
            ? "Aggressive"
            : "Moderate",
      description: portfolio.description || "",
      strategy: portfolio.assets.map((asset) => ({
        type: asset.type,
        percentage: asset.allocation,
        color: this.getAssetColor(asset.type),
      })),
      riskLevel: portfolio.riskLevel,
      lastUpdated: portfolio.updatedAt,
    };
  }

  private static getAssetColor(type: string): string {
    const colorMap: Record<string, string> = {
      Cash: "var(--asset-cash)",
      Equities: "var(--asset-equities)",
      "Fixed Income": "var(--asset-fixed-income)",
      Alternatives: "var(--asset-alternatives)",
    };
    return colorMap[type] || "var(--asset-equities)";
  }

  private static getZeroMetrics(): PortfolioMetrics {
    return {
      baseAmount: BASE_AMOUNT,
      currentValue: BASE_AMOUNT,
      totalReturn: 0,
      totalReturnPercent: 0,
      annualizedReturn: 0,
      annualizedReturnPercent: 0,
      volatility: 0,
      sortinoRatio: 0,
      maxDrawdown: 0,
      dayChange: 0,
      dayChangePercent: 0,
      startDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString(),
    };
  }
}
