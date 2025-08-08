import { Router } from "express";
import { scenarioController } from "../controllers/scenario.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/stress-test", authenticate, scenarioController.runStressTest);
router.post("/monte-carlo", authenticate, scenarioController.runMonteCarlo);

export default router;
