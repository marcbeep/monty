import { Router, Request, Response } from "express";
import { success } from "../utils/response";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  // Placeholder for portfolios list
  return success(res, { message: "Portfolios endpoint" });
});

export default router;
