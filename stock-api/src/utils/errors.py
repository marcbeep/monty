class AppError(Exception):
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


def BadRequest(msg: str) -> AppError:
    return AppError(msg, 400)


def Unauthorized(msg: str = "Unauthorized") -> AppError:
    return AppError(msg, 401)


def Forbidden(msg: str = "Forbidden") -> AppError:
    return AppError(msg, 403)


def NotFound(msg: str = "Not found") -> AppError:
    return AppError(msg, 404)


def InternalServerError(msg: str = "Internal server error") -> AppError:
    return AppError(msg, 500)
