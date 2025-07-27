import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { loginSchema, signupSchema } from "../utils/validation";

const router = Router();

router.post("/login", validate(loginSchema), authController.login);
router.post("/signup", validate(signupSchema), authController.signup);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.me);

export default router;
