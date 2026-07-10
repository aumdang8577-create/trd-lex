from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import connect_db, disconnect_db
from app.routes import auth, contracts, listings, dashboard, calculator

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: connect to database
    await connect_db()
    yield
    # Shutdown: disconnect from database
    await disconnect_db()

app = FastAPI(
    title="TRD Lease Exchange (TRD-LEX) API",
    description="Backend API Service for the TRD-LEX Treasury Marketplace Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific domains in production (e.g. ["http://localhost:3000"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root status health check
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "api_version": settings.API_VERSION,
        "environment": "development"
    }

# Include routers
app.include_router(auth.router)
app.include_router(contracts.router)
app.include_router(listings.router)
app.include_router(dashboard.router)
app.include_router(calculator.router)
