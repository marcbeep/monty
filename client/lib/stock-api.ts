import { api } from "./api";
import type { Asset } from "@/types/asset";

export interface StockSearchResult {
  symbol: string;
  name: string;
}

export interface StockBasicResult {
  symbol: string;
  name: string;
  current_price?: number;
  sector?: string;
}

export interface HistoricalDataPoint {
  date: string;
  close: number;
}

export interface StockHistoryResult {
  symbol: string;
  period: string;
  data: HistoricalDataPoint[];
}

const STOCK_API_BASE = "http://localhost:8001";

export const stockApi = {
  searchStocks: (
    query: string,
    limit: number = 10
  ): Promise<StockSearchResult[]> =>
    api.get<StockSearchResult[]>(
      `/api/v1/stocks/search?q=${encodeURIComponent(query)}&limit=${limit}`
    ),

  getStockBasic: (symbol: string): Promise<StockBasicResult> =>
    api.get<StockBasicResult>(
      `/api/v1/stocks/${encodeURIComponent(symbol)}/basic`
    ),

  getHistory: async (
    symbol: string,
    period: string = "1y"
  ): Promise<HistoricalDataPoint[]> => {
    const response = await fetch(
      `${STOCK_API_BASE}/api/history/${encodeURIComponent(symbol)}?period=${period}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch history for ${symbol}`);
    }

    const result: { success: boolean; data: StockHistoryResult } =
      await response.json();

    if (!result.success) {
      throw new Error(`Stock API error for ${symbol}`);
    }

    return result.data.data;
  },
};

export const transformToAsset = (stock: StockSearchResult): Asset => ({
  symbol: stock.symbol,
  name: stock.name,
  type: "Unassigned",
});
