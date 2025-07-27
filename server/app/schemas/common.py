from typing import Any, Optional
from pydantic import BaseModel


class SuccessResponse(BaseModel):
    success: bool = True
    data: Any
    meta: Optional[dict] = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: dict
    meta: Optional[dict] = None
