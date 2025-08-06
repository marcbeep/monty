from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config.settings import CORS_ORIGINS, HOST, PORT
from .controllers.scenario_controller import router as scenario_router
from .middleware.error_handler import error_handler

app = FastAPI(
    title="Scenario API",
    version="1.0.0",
    description="Portfolio scenario analysis and Monte Carlo simulation API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.middleware("http")(error_handler)

app.include_router(scenario_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"success": True, "data": {"message": "Scenario API is running"}}
