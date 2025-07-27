export interface PortfolioResponse {
  id: string;
  name: string;
  description: string;
  holdings: PortfolioHoldingResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioHoldingResponse {
  id: string;
  symbol: string;
  allocationPercentage: number;
  createdAt: string;
}
