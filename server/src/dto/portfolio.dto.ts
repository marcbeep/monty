import { z } from "zod";

// Request schemas
export const createPortfolioSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  riskLevel: z.enum(["Low", "Medium", "High"]),
  assets: z.array(
    z.object({
      symbol: z.string().min(1),
      name: z.string().min(1),
      type: z.enum(["Cash", "Equities", "Fixed Income", "Alternatives"]),
      allocation: z.number().min(0).max(100),
    })
  ),
});

export const updatePortfolioSchema = createPortfolioSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreatePortfolioRequest = z.infer<typeof createPortfolioSchema>;
export type UpdatePortfolioRequest = z.infer<typeof updatePortfolioSchema>;

// Response types
export interface PortfolioResponse {
  id: string;
  name: string;
  description: string | null;
  riskLevel: "Low" | "Medium" | "High";
  assets: PortfolioAssetResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioAssetResponse {
  symbol: string;
  name: string;
  type: "Cash" | "Equities" | "Fixed Income" | "Alternatives";
  allocation: number;
}
