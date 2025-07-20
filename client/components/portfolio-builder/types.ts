import type { AssetType } from "@/lib/mock-data";

export interface Asset {
  symbol: string;
  name: string;
  type: AssetType;
}

export interface PortfolioAsset extends Asset {
  allocation: number;
}

export interface ExistingPortfolio {
  id: number;
  name: string;
}
