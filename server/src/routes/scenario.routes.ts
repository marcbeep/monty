import { Router } from "express";
import { scenarioController } from "../controllers/scenario.controller";

const router = Router();

router.post("/stress-test", scenarioController.runStressTest);
router.post("/monte-carlo", scenarioController.runMonteCarlo);
router.get("/health", scenarioController.healthCheck);

export default router;
