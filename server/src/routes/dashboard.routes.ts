import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/portfolios",
  authenticate,
  dashboardController.getPortfolioSummaries
);
router.get(
  "/portfolio/:id",
  authenticate,
  dashboardController.getPortfolioDashboard
);

export default router;
