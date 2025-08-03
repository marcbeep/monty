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

  getHistory: (
    symbol: string,
    period: string = "1y"
  ): Promise<HistoricalDataPoint[]> =>
    api.get<HistoricalDataPoint[]>(
      `/api/v1/stocks/${encodeURIComponent(symbol)}/history?period=${period}`
    ),
};

export const transformToAsset = (stock: StockSearchResult): Asset => ({
  symbol: stock.symbol,
  name: stock.name,
  type: "Unassigned",
});
