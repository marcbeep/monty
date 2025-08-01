import { Router } from "express";
import authRoutes from "./auth.routes";
import portfolioRoutes from "./portfolio.routes";
import stockRoutes from "./stock.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/portfolios", portfolioRoutes);
router.use("/stocks", stockRoutes);

router.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
