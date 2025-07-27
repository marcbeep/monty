import { Response, NextFunction } from "express";
import { portfolioService } from "../services/portfolio.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class PortfolioController {
  async getPortfolios(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const portfolios = await portfolioService.getUserPortfolios(req.user!.id);
      res.json({ success: true, data: portfolios });
    } catch (error) {
      next(error);
    }
  }
}

export const portfolioController = new PortfolioController();
