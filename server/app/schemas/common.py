from typing import Any, Optional, Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T
    meta: Optional[dict] = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: dict
    meta: Optional[dict] = None
