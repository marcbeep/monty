export class AppError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
  }
}

export const BadRequest = (msg: string) => new AppError(msg, 400);
export const Unauthorized = (msg: string = "Unauthorized") =>
  new AppError(msg, 401);
export const Forbidden = (msg: string = "Forbidden") => new AppError(msg, 403);
export const NotFound = (msg: string = "Not found") => new AppError(msg, 404);
