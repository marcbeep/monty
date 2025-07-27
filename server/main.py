from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import (
    dashboard,
    portfolios,
    assets,
    backtester,
    comparison,
    settings as user_settings,
    auth,
)

# Create FastAPI app
app = FastAPI(
    title="Monty Portfolio Backtester API",
    description="API for portfolio backtesting and analysis",
    version="1.0.0",
)

# Add CORS middleware with simple safe defaults
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Simple default - configure at deployment level if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(portfolios.router, prefix="/api/portfolios", tags=["Portfolios"])
app.include_router(assets.router, prefix="/api/assets", tags=["Assets"])
app.include_router(backtester.router, prefix="/api/backtester", tags=["Backtesting"])
app.include_router(comparison.router, prefix="/api/comparison", tags=["Comparison"])
app.include_router(user_settings.router, prefix="/api/settings", tags=["Settings"])


@app.get("/")
def read_root():
    """Root endpoint with API information."""
    return {
        "message": "Monty Portfolio Backtester API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    from datetime import datetime

    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn
    import os

    # Simple defaults that work in any deployment environment
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=False,  # Never reload in production
    )
