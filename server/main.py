from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
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

# Global variable to track if app is ready
app_ready = False


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown."""
    global app_ready

    # Startup
    print("🚀 Starting Monty API...")
    try:
        # Give Railway a moment to inject environment variables
        import time

        time.sleep(0.5)

        # Try multiple ways to get environment variables for Railway
        supabase_url = (
            os.getenv("SUPABASE_URL")
            or os.getenv("supabase_url")
            or os.environ.get("SUPABASE_URL")
            or os.environ.get("supabase_url")
        )
        supabase_key = (
            os.getenv("SUPABASE_KEY")
            or os.getenv("supabase_key")
            or os.environ.get("SUPABASE_KEY")
            or os.environ.get("supabase_key")
        )

        print(f"🔍 Environment check:")
        print(f"   SUPABASE_URL found: {'✅' if supabase_url else '❌'}")
        print(f"   SUPABASE_KEY found: {'✅' if supabase_key else '❌'}")

        if supabase_url and supabase_key:
            print("✅ Environment variables loaded successfully")

            # Test that we can connect to Supabase
            from app.core.database import get_supabase

            supabase = get_supabase()
            print("✅ Supabase client created successfully")

            app_ready = True
            print("🎉 Monty API is ready to serve requests!")
        else:
            print("⚠️  Environment variables not found, but continuing...")
            print("   (They might be available when actually needed)")
            app_ready = False

    except Exception as e:
        print(f"⚠️  Startup warning: {e}")
        print("   Continuing anyway - environment variables might be available later")
        app_ready = False

    yield

    # Shutdown
    print("👋 Shutting down Monty API...")


# Create FastAPI app with Railway-optimized settings
app = FastAPI(
    title="Monty Portfolio Backtester API",
    description="API for portfolio backtesting and analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Add CORS middleware with simple safe defaults
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Simple default - configure at deployment level if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Railway health check endpoint (Railway often checks this)
@app.get("/health")
def health_check():
    """Health check endpoint for Railway."""
    # Always return OK - Railway just needs to know the service is responding
    return {"status": "ok", "ready": app_ready, "service": "monty-api"}


# Root endpoint - simple and fast for Railway
@app.get("/")
def read_root():
    """Root endpoint with API information."""
    return {
        "status": "running",
        "service": "monty-api",
        "version": "1.0.0",
        "ready": app_ready,
    }


# Alternative health check endpoints that Railway might try
@app.get("/healthz")
def healthz():
    """Kubernetes-style health check."""
    return {"status": "ok"}


@app.get("/ping")
def ping():
    """Simple ping endpoint."""
    return {"ping": "pong", "ready": app_ready}


@app.get("/debug/env")
def debug_env():
    """Debug endpoint to check environment variables (for troubleshooting only)."""
    import os

    supabase_vars = {
        k: "***SET***" if v else "NOT_SET"
        for k, v in os.environ.items()
        if "SUPABASE" in k.upper()
    }
    return {
        "supabase_env_vars": supabase_vars,
        "total_env_vars": len(os.environ),
        "app_ready": app_ready,
        "railway_env": "RAILWAY_ENVIRONMENT" in os.environ,
    }


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
