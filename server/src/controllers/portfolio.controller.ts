import { Request, Response, NextFunction } from "express";
import { portfolioService } from "../services/portfolio.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  createPortfolioSchema,
  updatePortfolioSchema,
} from "../dto/portfolio.dto";
import { BadRequest } from "../utils/errors";

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

  async getPortfolio(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) throw BadRequest("Portfolio ID is required");

      const portfolio = await portfolioService.getPortfolioById(
        req.user!.id,
        id
      );
      res.json({ success: true, data: portfolio });
    } catch (error) {
      next(error);
    }
  }

  async createPortfolio(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = createPortfolioSchema.parse(req.body);
      const portfolio = await portfolioService.createPortfolio(
        req.user!.id,
        data
      );
      res.status(201).json({ success: true, data: portfolio });
    } catch (error) {
      next(error);
    }
  }

  async updatePortfolio(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) throw BadRequest("Portfolio ID is required");

      const data = updatePortfolioSchema.parse({ ...req.body, id });
      const portfolio = await portfolioService.updatePortfolio(
        req.user!.id,
        data
      );
      res.json({ success: true, data: portfolio });
    } catch (error) {
      next(error);
    }
  }

  async deletePortfolio(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) throw BadRequest("Portfolio ID is required");

      await portfolioService.deletePortfolio(req.user!.id, id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}

export const portfolioController = new PortfolioController();
