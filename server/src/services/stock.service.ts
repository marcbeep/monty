import {
  StockSearchResult,
  StockBasicResult,
  StockHistoryResult,
  HistoricalDataPoint,
} from "../dto/stock.dto";
import { AppError, NotFound } from "../utils/errors";

const STOCK_API_URL =
  process.env["STOCK_API_URL"] || "https://stock.monty.marc.tt";
const CACHE_DURATION = 300000; // 5 minutes

// Valid timeframes matching our UI and Python API
const VALID_TIMEFRAMES = ["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"];

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface StockApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export class StockService {
  private searchCache = new Map<string, CacheEntry<StockSearchResult[]>>();
  private quoteCache = new Map<string, CacheEntry<StockBasicResult>>();
  private historyCache = new Map<string, CacheEntry<HistoricalDataPoint[]>>();

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

  async searchStocks(
    query: string,
    limit: number = 10
  ): Promise<StockSearchResult[]> {
    const cacheKey = `${query}:${limit}`;
    const cached = this.searchCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const url = `${STOCK_API_URL}/api/search?q=${encodeURIComponent(
        query
      )}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new AppError(`Stock API responded with ${response.status}`, 500);
      }

      const result = (await response.json()) as StockApiResponse<any[]>;

      if (!result.success) {
        throw new AppError(result.error || "Search failed", 500);
      }

      // Transform stock-api response to match frontend Asset interface
      const transformedData: StockSearchResult[] = result.data.map(
        (item: any) => ({
          symbol: item.symbol,
          name: item.name,
        })
      );

      this.searchCache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now(),
      });

      return transformedData;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Stock search failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async getStockBasic(symbol: string): Promise<StockBasicResult> {
    const cached = this.quoteCache.get(symbol);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const url = `${STOCK_API_URL}/api/basic/${encodeURIComponent(symbol)}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw NotFound("Symbol not found");
        }
        throw new AppError(`Stock API responded with ${response.status}`, 500);
      }

      const result = (await response.json()) as StockApiResponse<any>;

      if (!result.success) {
        throw new AppError(result.error || "Quote failed", 500);
      }

      const transformedData: StockBasicResult = {
        symbol: result.data.symbol,
        name: result.data.name,
        current_price: result.data.current_price,
        sector: result.data.sector,
      };

      this.quoteCache.set(symbol, {
        data: transformedData,
        timestamp: Date.now(),
      });

      return transformedData;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Stock quote failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async getStockHistory(
    symbol: string,
    timeframe: string = "1Y"
  ): Promise<HistoricalDataPoint[]> {
    // Validate timeframe
    this.validateTimeframe(timeframe);

    const timeframeUpper = timeframe.toUpperCase();
    const cacheKey = `${symbol}:${timeframeUpper}`;
    const cached = this.historyCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const url = `${STOCK_API_URL}/api/history/${encodeURIComponent(
        symbol
      )}?timeframe=${timeframe}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw NotFound("Symbol not found");
        }
        throw new AppError(`Stock API responded with ${response.status}`, 500);
      }

      const result =
        (await response.json()) as StockApiResponse<StockHistoryResult>;

      if (!result.success) {
        throw new AppError(result.error || "History failed", 500);
      }

      // Extract the historical data points from the response
      const historyData: HistoricalDataPoint[] = result.data.data;

      this.historyCache.set(cacheKey, {
        data: historyData,
        timestamp: Date.now(),
      });

      return historyData;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Stock history failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }

  async getDataAvailability(
    symbol: string
  ): Promise<Record<string, string | null>> {
    try {
      const url = `${STOCK_API_URL}/api/availability/${encodeURIComponent(
        symbol
      )}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw NotFound("Symbol not found");
        }
        throw new AppError(`Stock API responded with ${response.status}`, 500);
      }

      const result = (await response.json()) as StockApiResponse<
        Record<string, string | null>
      >;

      if (!result.success) {
        throw new AppError(result.error || "Availability check failed", 500);
      }

      return result.data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        `Data availability check failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500
      );
    }
  }
}

export const stockService = new StockService();
