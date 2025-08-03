import { Router } from "express";
import { stockController } from "../controllers/stock.controller";

const router = Router();

router.get("/search", stockController.searchStocks);
router.get("/:symbol/basic", stockController.getStockBasic);
router.get("/:symbol/history", stockController.getStockHistory);

export default router;
