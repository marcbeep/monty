import { supabase } from "../config/supabase";
import { PortfolioResponse } from "../dto/portfolio.dto";
import { AppError } from "../utils/errors";

export class PortfolioService {
  async createStarterPortfolios(userId: string): Promise<void> {
    console.log(`Creating starter portfolios for user: ${userId}`);

    const portfolios = [
      {
        name: "Conservative Portfolio",
        description: "Capital preservation with steady income",
        holdings: [
          { symbol: "BND", allocation: 60.0 },
          { symbol: "SCHD", allocation: 20.0 },
          { symbol: "VT", allocation: 10.0 },
          { symbol: "VGSH", allocation: 10.0 },
        ],
      },
      {
        name: "Moderate Portfolio",
        description: "Balanced growth and income approach",
        holdings: [
          { symbol: "VTI", allocation: 35.0 },
          { symbol: "VXUS", allocation: 20.0 },
          { symbol: "BND", allocation: 30.0 },
          { symbol: "VNQ", allocation: 10.0 },
          { symbol: "TIP", allocation: 5.0 },
        ],
      },
      {
        name: "Aggressive Portfolio",
        description: "Growth-focused with higher risk tolerance",
        holdings: [
          { symbol: "QQQ", allocation: 30.0 },
          { symbol: "VTI", allocation: 30.0 },
          { symbol: "IEMG", allocation: 15.0 },
          { symbol: "VXUS", allocation: 15.0 },
          { symbol: "ARKK", allocation: 10.0 },
        ],
      },
    ];

    for (const portfolio of portfolios) {
      console.log(`Creating portfolio: ${portfolio.name}`);

      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolios")
        .insert({
          user_id: userId,
          name: portfolio.name,
          description: portfolio.description,
        })
        .select()
        .single();

      if (portfolioError) {
        console.error(
          `Portfolio creation failed for ${portfolio.name}:`,
          portfolioError
        );
        throw new AppError(portfolioError.message, 500);
      }

      console.log(`Portfolio created with ID: ${portfolioData.id}`);

      const holdings = portfolio.holdings.map((h) => ({
        portfolio_id: portfolioData.id,
        symbol: h.symbol,
        allocation_percentage: h.allocation,
      }));

      const { error: holdingsError } = await supabase
        .from("portfolio_holdings")
        .insert(holdings);

      if (holdingsError) {
        console.error(
          `Holdings creation failed for ${portfolio.name}:`,
          holdingsError
        );
        throw new AppError(holdingsError.message, 500);
      }

      console.log(
        `Holdings created for ${portfolio.name}: ${holdings.length} assets`
      );
    }

    console.log(
      `Successfully created all starter portfolios for user: ${userId}`
    );
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

    return data.map((portfolio) => ({
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.description,
      holdings: portfolio.portfolio_holdings.map((holding: any) => ({
        id: holding.id,
        symbol: holding.symbol,
        allocationPercentage: holding.allocation_percentage,
        createdAt: holding.created_at,
      })),
      createdAt: portfolio.created_at,
      updatedAt: portfolio.updated_at,
    }));
  }
}

export const portfolioService = new PortfolioService();
