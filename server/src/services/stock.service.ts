import { StockSearchResult, StockBasicResult } from "../dto/stock.dto";
import { AppError, NotFound } from "../utils/errors";

const STOCK_API_URL = process.env["STOCK_API_URL"] || "http://localhost:8001";
const CACHE_DURATION = 300000; // 5 minutes

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
          type: this.mapAssetType(item.type),
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

  private mapAssetType(
    stockApiType: string
  ): "Cash" | "Equities" | "Fixed Income" | "Alternatives" {
    switch (stockApiType) {
      case "Fixed Income":
        return "Fixed Income";
      case "Alternatives":
        return "Alternatives";
      case "Equities":
      default:
        return "Equities";
    }
  }
}

export const stockService = new StockService();
