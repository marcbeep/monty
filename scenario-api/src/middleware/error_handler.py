from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from ..utils.errors import ScenarioAPIError
import logging

logger = logging.getLogger(__name__)


async def error_handler(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except HTTPException as e:
        return JSONResponse(
            status_code=e.status_code, content={"success": False, "error": e.detail}
        )
    except ScenarioAPIError as e:
        return JSONResponse(
            status_code=e.status_code, content={"success": False, "error": e.message}
        )
    except Exception as e:
        logger.error(f"Unhandled error: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": "Internal server error"},
        )
