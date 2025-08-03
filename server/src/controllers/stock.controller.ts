import { Request, Response, NextFunction } from "express";
import { stockService } from "../services/stock.service";
import {
  stockSearchSchema,
  stockSymbolSchema,
  stockHistorySchema,
} from "../dto/stock.dto";
import { BadRequest } from "../utils/errors";

export class StockController {
  async searchStocks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = stockSearchSchema.parse({
        q: req.query["q"],
        limit: req.query["limit"] ? Number(req.query["limit"]) : undefined,
      });

      const stocks = await stockService.searchStocks(query.q, query.limit);
      res.json({ success: true, data: stocks });
    } catch (error) {
      next(error);
    }
  }

  async getStockBasic(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { symbol } = req.params;
      if (!symbol) throw BadRequest("Symbol is required");

      const validated = stockSymbolSchema.parse({ symbol });
      const stock = await stockService.getStockBasic(validated.symbol);
      res.json({ success: true, data: stock });
    } catch (error) {
      next(error);
    }
  }

  async getStockHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { symbol } = req.params;
      const { period } = req.query;

      if (!symbol) throw BadRequest("Symbol is required");

      const validated = stockHistorySchema.parse({
        symbol,
        period: period as string,
      });

      const history = await stockService.getStockHistory(
        validated.symbol,
        validated.period
      );
      res.json({ success: true, data: history });
    } catch (error) {
      next(error);
    }
  }
}

export const stockController = new StockController();
