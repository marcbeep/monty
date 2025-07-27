import { Router, Request, Response } from "express";
import { success } from "../utils/response";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  // Placeholder for backtester data
  return success(res, { message: "Backtester endpoint" });
});

export default router;
