import { Router } from "express";
import { portfolioController } from "../controllers/portfolio.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, portfolioController.getPortfolios);

export { router as portfolioRoutes };
