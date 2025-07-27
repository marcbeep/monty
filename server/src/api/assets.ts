import { Router, Request, Response } from "express";
import { success } from "../utils/response";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  // Placeholder for assets data
  return success(res, { message: "Assets endpoint" });
});

export default router;
