import { api } from "./api";
import type {
  PortfolioResponse,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
} from "@/types/portfolio";

export const portfolioApi = {
  // Get all user portfolios
  getPortfolios: () => api.get<PortfolioResponse[]>("/api/v1/portfolios"),

  // Get specific portfolio by ID
  getPortfolio: (id: string) =>
    api.get<PortfolioResponse>(`/api/v1/portfolios/${id}`),

  // Create new portfolio
  createPortfolio: (data: CreatePortfolioRequest) =>
    api.post<PortfolioResponse>("/api/v1/portfolios", data),

  // Update existing portfolio
  updatePortfolio: (id: string, data: Omit<UpdatePortfolioRequest, "id">) =>
    api.put<PortfolioResponse>(`/api/v1/portfolios/${id}`, data),

  // Delete portfolio
  deletePortfolio: (id: string) => api.delete<void>(`/api/v1/portfolios/${id}`),
};
