import { supabase } from "../config/supabase";
import {
  PortfolioResponse,
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
} from "../dto/portfolio.dto";
import { AppError } from "../utils/errors";

export class PortfolioService {
  async createPortfolio(
    userId: string,
    data: CreatePortfolioRequest
  ): Promise<PortfolioResponse> {
    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .insert({
        user_id: userId,
        name: data.name,
        description: data.description || null,
        risk_level: data.riskLevel,
      })
      .select()
      .single();

    if (portfolioError) throw new AppError(portfolioError.message, 500);

    if (data.assets?.length) {
      const holdings = data.assets.map((asset) => ({
        portfolio_id: portfolio.id,
        symbol: asset.symbol,
        asset_name: asset.name,
        asset_type: asset.type,
        allocation_percentage: asset.allocation,
      }));

      const { error: holdingsError } = await supabase
        .from("portfolio_holdings")
        .insert(holdings);

      if (holdingsError) throw new AppError(holdingsError.message, 500);
    }

    return this.getPortfolioById(userId, portfolio.id);
  }

  async updatePortfolio(
    userId: string,
    data: UpdatePortfolioRequest
  ): Promise<PortfolioResponse> {
    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolios")
      .update({
        name: data.name,
        description: data.description,
        risk_level: data.riskLevel,
      })
      .eq("id", data.id)
      .eq("user_id", userId)
      .select()
      .single();

    if (portfolioError) throw new AppError(portfolioError.message, 500);

    if (data.assets) {
      await supabase
        .from("portfolio_holdings")
        .delete()
        .eq("portfolio_id", data.id);

      if (data.assets.length) {
        const holdings = data.assets.map((asset) => ({
          portfolio_id: data.id,
          symbol: asset.symbol,
          asset_name: asset.name,
          asset_type: asset.type,
          allocation_percentage: asset.allocation,
        }));

        const { error: holdingsError } = await supabase
          .from("portfolio_holdings")
          .insert(holdings);

        if (holdingsError) throw new AppError(holdingsError.message, 500);
      }
    }

    return this.getPortfolioById(userId, data.id!);
  }

  async deletePortfolio(userId: string, portfolioId: string): Promise<void> {
    const { error } = await supabase
      .from("portfolios")
      .delete()
      .eq("id", portfolioId)
      .eq("user_id", userId);

    if (error) throw new AppError(error.message, 500);
  }

  async getPortfolioById(
    userId: string,
    portfolioId: string
  ): Promise<PortfolioResponse> {
    const { data, error } = await supabase
      .from("portfolios")
      .select(
        `
        *,
        portfolio_holdings (*)
      `
      )
      .eq("id", portfolioId)
      .eq("user_id", userId)
      .single();

    if (error) throw new AppError(error.message, 500);
    if (!data) throw new AppError("Portfolio not found", 404);

    return this.mapPortfolioResponse(data);
  }

  async getUserPortfolios(userId: string): Promise<PortfolioResponse[]> {
    const { data, error } = await supabase
      .from("portfolios")
      .select(
        `
        *,
        portfolio_holdings (*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new AppError(error.message, 500);

    return data.map((portfolio) => this.mapPortfolioResponse(portfolio));
  }

  private mapPortfolioResponse(data: any): PortfolioResponse {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      riskLevel: data.risk_level,
      assets: data.portfolio_holdings.map((holding: any) => ({
        symbol: holding.symbol,
        name: holding.asset_name,
        type: holding.asset_type,
        allocation: holding.allocation_percentage,
      })),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async createStarterPortfolios(userId: string): Promise<void> {
    const portfolios = [
      {
        name: "Conservative Portfolio",
        description: "Capital preservation with steady income",
        riskLevel: "Low" as const,
        assets: [
          {
            symbol: "BND",
            name: "Vanguard Total Bond Market ETF",
            type: "Fixed Income" as const,
            allocation: 60.0,
          },
          {
            symbol: "SCHD",
            name: "Schwab US Dividend Equity ETF",
            type: "Equities" as const,
            allocation: 20.0,
          },
          {
            symbol: "VT",
            name: "Vanguard Total World Stock ETF",
            type: "Equities" as const,
            allocation: 10.0,
          },
          {
            symbol: "VGSH",
            name: "Vanguard Short-Term Treasury ETF",
            type: "Fixed Income" as const,
            allocation: 10.0,
          },
        ],
      },
      {
        name: "Moderate Portfolio",
        description: "Balanced growth and income approach",
        riskLevel: "Medium" as const,
        assets: [
          {
            symbol: "VTI",
            name: "Vanguard Total Stock Market ETF",
            type: "Equities" as const,
            allocation: 35.0,
          },
          {
            symbol: "VXUS",
            name: "Vanguard Total International Stock ETF",
            type: "Equities" as const,
            allocation: 20.0,
          },
          {
            symbol: "BND",
            name: "Vanguard Total Bond Market ETF",
            type: "Fixed Income" as const,
            allocation: 30.0,
          },
          {
            symbol: "VNQ",
            name: "Vanguard Real Estate Index Fund ETF",
            type: "Alternatives" as const,
            allocation: 10.0,
          },
          {
            symbol: "TIP",
            name: "iShares TIPS Bond ETF",
            type: "Fixed Income" as const,
            allocation: 5.0,
          },
        ],
      },
      {
        name: "Aggressive Portfolio",
        description: "Growth-focused with higher risk tolerance",
        riskLevel: "High" as const,
        assets: [
          {
            symbol: "QQQ",
            name: "Invesco QQQ Trust ETF",
            type: "Equities" as const,
            allocation: 30.0,
          },
          {
            symbol: "VTI",
            name: "Vanguard Total Stock Market ETF",
            type: "Equities" as const,
            allocation: 30.0,
          },
          {
            symbol: "IEMG",
            name: "iShares Core MSCI Emerging Markets ETF",
            type: "Equities" as const,
            allocation: 15.0,
          },
          {
            symbol: "VXUS",
            name: "Vanguard Total International Stock ETF",
            type: "Equities" as const,
            allocation: 15.0,
          },
          {
            symbol: "ARKK",
            name: "ARK Innovation ETF",
            type: "Equities" as const,
            allocation: 10.0,
          },
        ],
      },
    ];

    for (const portfolio of portfolios) {
      await this.createPortfolio(userId, portfolio);
    }
  }
}

export const portfolioService = new PortfolioService();
