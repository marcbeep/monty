import { Response, NextFunction } from "express";
import { scenarioService } from "../services/scenario.service";
import { stressTestSchema, monteCarloSchema } from "../dto/scenario.dto";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { portfolioService } from "../services/portfolio.service";
import { AppError, BadRequest } from "../utils/errors";

export class ScenarioController {
  async runStressTest(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = stressTestSchema.parse(req.body);

      if (!req.user?.id) throw new AppError("Unauthorized", 401);

      // Map numeric portfolio_id to actual UUID and fetch holdings
      const displayId = validated.portfolio_id;
      if (!Number.isInteger(displayId) || displayId <= 0) {
        throw BadRequest("Invalid portfolio id");
      }

      const userPortfolios = await portfolioService.getUserPortfolios(
        req.user.id
      );
      const index = displayId - 1; // 1-based display id
      if (index < 0 || index >= userPortfolios.length) {
        throw new AppError("Portfolio not found", 404);
      }
      const selectedId = userPortfolios[index]?.id;
      if (!selectedId) {
        throw new AppError("Portfolio not found", 404);
      }
      const fullPortfolio = await portfolioService.getPortfolioById(
        req.user.id,
        selectedId
      );

      const holdings = fullPortfolio.assets.map((a) => ({
        symbol: a.symbol,
        allocation: a.allocation,
        type: a.type,
        name: a.name,
      }));

      const enriched = {
        ...validated,
        holdings,
      } as any;

      const result = await scenarioService.runStressTest(enriched);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async runMonteCarlo(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = monteCarloSchema.parse(req.body);

      if (!req.user?.id) throw new AppError("Unauthorized", 401);

      // Map numeric portfolio_id to actual UUID and fetch holdings
      const displayId = validated.portfolio_id;
      if (!Number.isInteger(displayId) || displayId <= 0) {
        throw BadRequest("Invalid portfolio id");
      }

      const userPortfolios = await portfolioService.getUserPortfolios(
        req.user.id
      );
      const index = displayId - 1; // 1-based display id
      if (index < 0 || index >= userPortfolios.length) {
        throw new AppError("Portfolio not found", 404);
      }
      const selectedId = userPortfolios[index]?.id;
      if (!selectedId) {
        throw new AppError("Portfolio not found", 404);
      }
      const fullPortfolio = await portfolioService.getPortfolioById(
        req.user.id,
        selectedId
      );

      const holdings = fullPortfolio.assets.map((a) => ({
        symbol: a.symbol,
        allocation: a.allocation,
        type: a.type,
        name: a.name,
      }));

      const enriched = {
        ...validated,
        holdings,
      } as any;

      const result = await scenarioService.runMonteCarlo(enriched);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async healthCheck(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const health = await scenarioService.healthCheck();
      res.json({ success: true, data: health });
    } catch (error) {
      next(error);
    }
  }
}

export const scenarioController = new ScenarioController();
