import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { LoginInput, SignupInput } from "../utils/validation";
import { Unauthorized } from "../utils/errors";

export class AuthController {
  async login(
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await authService.login(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async signup(
    req: Request<{}, {}, SignupInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async logout(
    _req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await authService.logout();
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async me(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw Unauthorized();
      const user = await authService.getUser(token);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
