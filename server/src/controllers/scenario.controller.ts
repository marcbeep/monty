import { Request, Response, NextFunction } from "express";
import { scenarioService } from "../services/scenario.service";
import { stressTestSchema, monteCarloSchema } from "../dto/scenario.dto";

export class ScenarioController {
  async runStressTest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = stressTestSchema.parse(req.body);

      const result = await scenarioService.runStressTest(validated);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async runMonteCarlo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validated = monteCarloSchema.parse(req.body);

      const result = await scenarioService.runMonteCarlo(validated);
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
