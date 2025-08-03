import { z } from "zod";

// Request schemas
export const stockSearchSchema = z.object({
  q: z.string().min(1, "Query is required"),
  limit: z.number().min(1).max(50).optional().default(10),
});

export const stockSymbolSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
});

export const stockHistorySchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  period: z.string().optional().default("1y"),
});

export type StockSearchRequest = z.infer<typeof stockSearchSchema>;
export type StockSymbolRequest = z.infer<typeof stockSymbolSchema>;
export type StockHistoryRequest = z.infer<typeof stockHistorySchema>;

// Response types (matching frontend Asset interface)
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
