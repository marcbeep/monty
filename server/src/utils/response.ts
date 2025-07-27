import { Response } from "express";
import { SuccessResponse, ErrorResponse } from "../types/common";

export const success = <T>(res: Response, data: T, status = 200): Response => {
  const response: SuccessResponse<T> = { success: true, data };
  return res.status(status).json(response);
};

export const error = (
  res: Response,
  message: string,
  status = 500,
  details?: any
): Response => {
  const response: ErrorResponse = { success: false, error: message, details };
  return res.status(status).json(response);
};
