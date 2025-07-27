import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { AppError } from "../utils/errors";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", error.message);

  // Handle operational errors (our custom AppError)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
    return;
  }

  // Handle unexpected errors
  res.status(500).json({
    success: false,
    error:
      env.NODE_ENV === "development" ? error.message : "Internal server error",
  });
};
