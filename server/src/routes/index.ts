import { Router } from "express";
import authRoutes from "./auth.routes";
import portfolioRoutes from "./portfolio.routes";
import stockRoutes from "./stock.routes";
import dashboardRoutes from "./dashboard.routes";
import scenarioRoutes from "./scenario.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/portfolios", portfolioRoutes);
router.use("/stocks", stockRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/scenarios", scenarioRoutes);

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "healthy",
      service: "monty-server-hub",
      version: "v1",
      api_prefix: "/api/v1",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
