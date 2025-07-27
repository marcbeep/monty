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
import os

# Create FastAPI app with Railway-optimized settings
app = FastAPI(
    title="Monty Portfolio Backtester API",
    description="API for portfolio backtesting and analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    # Railway-specific optimizations
    openapi_url="/openapi.json",
)

# Add CORS middleware with simple safe defaults
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Simple default - configure at deployment level if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variable to track if app is ready
app_ready = False


@app.on_event("startup")
async def startup_event():
    """Startup event to ensure app is fully ready."""
    global app_ready
    try:
        # Test that we can load configuration
        from app.core.config import get_settings

        settings = get_settings()
        print(f"✅ Configuration loaded successfully")

        # Test that we can connect to Supabase
        from app.core.database import get_supabase

        supabase = get_supabase()
        print(f"✅ Supabase client created successfully")

        app_ready = True
        print(f"🚀 Monty API is ready to serve requests!")

    except Exception as e:
        print(f"❌ Startup failed: {e}")
        app_ready = False


# Railway health check endpoint (Railway often checks this)
@app.get("/health")
def health_check():
    """Health check endpoint for Railway."""
    if app_ready:
        return {"status": "ok", "ready": True}
    else:
        return {"status": "starting", "ready": False}


# Root endpoint - simple and fast for Railway
@app.get("/")
def read_root():
    """Root endpoint with API information."""
    return {
        "status": "running" if app_ready else "starting",
        "service": "monty-api",
        "version": "1.0.0",
        "ready": app_ready,
    }


# Alternative health check endpoints that Railway might try
@app.get("/healthz")
def healthz():
    """Kubernetes-style health check."""
    return {"status": "ok" if app_ready else "starting"}


@app.get("/ping")
def ping():
    """Simple ping endpoint."""
    return {"ping": "pong", "ready": app_ready}


# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(portfolios.router, prefix="/api/portfolios", tags=["Portfolios"])
app.include_router(assets.router, prefix="/api/assets", tags=["Assets"])
app.include_router(backtester.router, prefix="/api/backtester", tags=["Backtesting"])
app.include_router(comparison.router, prefix="/api/comparison", tags=["Comparison"])
app.include_router(user_settings.router, prefix="/api/settings", tags=["Settings"])


if __name__ == "__main__":
    import uvicorn

    # Railway automatically sets PORT
    port = int(os.getenv("PORT", "8000"))

    print(f"🚀 Starting Monty API on port {port}")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        # Railway-optimized settings
        reload=False,
        access_log=False,  # Disable to reduce noise
        workers=1,
        timeout_keep_alive=30,
        loop="asyncio",
    )
