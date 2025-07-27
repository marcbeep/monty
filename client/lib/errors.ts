// Error handling utilities - consistent with server standards

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error factory functions - matching server patterns
export const BadRequest = (message: string) =>
  new AppError(message, 400, "BAD_REQUEST");
export const Unauthorized = (message: string) =>
  new AppError(message, 401, "UNAUTHORIZED");
export const Forbidden = (message: string) =>
  new AppError(message, 403, "FORBIDDEN");
export const NotFound = (message: string) =>
  new AppError(message, 404, "NOT_FOUND");
export const Conflict = (message: string) =>
  new AppError(message, 409, "CONFLICT");
export const ValidationError = (message: string) =>
  new AppError(message, 422, "VALIDATION_ERROR");
export const InternalServerError = (message: string) =>
  new AppError(message, 500, "INTERNAL_ERROR");

// Network and client-specific errors
export const NetworkError = (message: string) =>
  new AppError(message, 0, "NETWORK_ERROR");
export const TimeoutError = (message: string) =>
  new AppError(message, 0, "TIMEOUT_ERROR");
export const ParseError = (message: string) =>
  new AppError(message, 0, "PARSE_ERROR");

// Error type guards
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const isNetworkError = (error: unknown): error is AppError => {
  return (
    isAppError(error) &&
    (error.code === "NETWORK_ERROR" || error.statusCode === 0)
  );
};

// Error handler for displaying user-friendly messages
export const getErrorMessage = (error: unknown): string => {
  if (isAppError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

// Error severity levels
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

export const getErrorSeverity = (error: unknown): ErrorSeverity => {
  if (!isAppError(error)) return "medium";

  switch (error.statusCode) {
    case 400:
    case 422:
      return "low";
    case 401:
    case 403:
      return "medium";
    case 404:
      return "low";
    case 500:
      return "high";
    default:
      if (error.statusCode === 0) return "high"; // Network errors
      return "medium";
  }
};
