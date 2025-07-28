import { z } from "zod";

// Request schemas
export const stockSearchSchema = z.object({
  q: z.string().min(1, "Query is required"),
  limit: z.number().min(1).max(50).optional().default(10),
});

export const stockSymbolSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
});

export type StockSearchRequest = z.infer<typeof stockSearchSchema>;
export type StockSymbolRequest = z.infer<typeof stockSymbolSchema>;

// Response types (matching frontend Asset interface)
export interface StockSearchResult {
  symbol: string;
  name: string;
  type: "Cash" | "Equities" | "Fixed Income" | "Alternatives";
}

export interface StockBasicResult {
  symbol: string;
  name: string;
  current_price?: number;
  sector?: string;
}
