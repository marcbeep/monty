class ScenarioAPIError(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class BadRequest(ScenarioAPIError):
    def __init__(self, message: str):
        super().__init__(message, 400)


class NotFound(ScenarioAPIError):
    def __init__(self, message: str):
        super().__init__(message, 404)


class InternalError(ScenarioAPIError):
    def __init__(self, message: str):
        super().__init__(message, 500)
