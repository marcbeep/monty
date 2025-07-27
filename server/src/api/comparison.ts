import { Router, Request, Response } from "express";
import { success } from "../utils/response";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  // Placeholder for comparison data
  return success(res, { message: "Comparison endpoint" });
});

export default router;
