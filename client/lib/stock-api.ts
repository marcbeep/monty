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

export const stockApi = {
  // Search stocks with real-time data
  searchStocks: (
    query: string,
    limit: number = 10
  ): Promise<StockSearchResult[]> =>
    api.get<StockSearchResult[]>(
      `/api/v1/stocks/search?q=${encodeURIComponent(query)}&limit=${limit}`
    ),

  // Get basic stock information
  getStockBasic: (symbol: string): Promise<StockBasicResult> =>
    api.get<StockBasicResult>(
      `/api/v1/stocks/${encodeURIComponent(symbol)}/basic`
    ),
};

// Transform server response to frontend Asset interface
export const transformToAsset = (stock: StockSearchResult): Asset => ({
  symbol: stock.symbol,
  name: stock.name,
  type: "Unassigned", // User must specify asset type manually
});
