import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ success: false, error: "No token" });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({ success: false, error: "Invalid token" });
    return;
  }

  req.user = { id: data.user.id, email: data.user.email || "" };
  next();
};
