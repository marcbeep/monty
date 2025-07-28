import { Router } from "express";
import { stockController } from "../controllers/stock.controller";

const router = Router();

router.get("/search", stockController.searchStocks);
router.get("/:symbol/basic", stockController.getStockBasic);

export default router;
