import { Router, Request, Response } from "express";
import { success } from "../utils/response";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  // Placeholder for settings data
  return success(res, { message: "Settings endpoint" });
});

export default router;
