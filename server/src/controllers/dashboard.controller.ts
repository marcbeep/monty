import { Response, NextFunction } from "express";
import { dashboardService } from "../services/dashboard.service";
import { dashboardPortfolioSchema } from "../dto/dashboard.dto";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { BadRequest } from "../utils/errors";

export class DashboardController {
  async getPortfolioDashboard(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { timeframe } = req.query;

      if (!id) throw BadRequest("Portfolio ID is required");

      const validated = dashboardPortfolioSchema.parse({
        id,
        timeframe: timeframe as string,
      });

      const dashboardData = await dashboardService.getDashboardData(
        req.user!.id,
        validated.id,
        validated.timeframe
      );

      res.json({ success: true, data: dashboardData });
    } catch (error) {
      next(error);
    }
  }

  async getPortfolioSummaries(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const portfolios = await dashboardService.getUserPortfolios(req.user!.id);
      res.json({ success: true, data: portfolios });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
