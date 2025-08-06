from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from .config.settings import CORS_ORIGINS, HOST, PORT
from .controllers.stock_controller import router as stock_router
from .middleware.error_handler import error_handler

app = FastAPI(
    title="Stock API", version="1.0.0", description="Clean stock market data API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,  # Can't use credentials with allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.middleware("http")(error_handler)

app.include_router(stock_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"success": True, "data": {"message": "Stock API is running"}}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=HOST, port=PORT)
