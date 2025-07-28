import { Router } from "express";
import { portfolioController } from "../controllers/portfolio.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, portfolioController.getPortfolios);
router.get("/:id", authenticate, portfolioController.getPortfolio);
router.post("/", authenticate, portfolioController.createPortfolio);
router.put("/:id", authenticate, portfolioController.updatePortfolio);
router.delete("/:id", authenticate, portfolioController.deletePortfolio);

export default router;
