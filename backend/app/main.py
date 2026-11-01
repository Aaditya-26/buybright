import logging
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine
from app.core.redis_client import redis_client
from app.routers import auth

# Configure standard logging to output errors and status messages
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI application with name from settings
app = FastAPI(
    title=settings.app_name,
    description="Multi-seller e-commerce marketplace API built with FastAPI, PostgreSQL, and Redis.",
    version="0.1.0",
)

# Enable CORS middleware so our frontend (e.g. React on Vite) can call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Authentication & Authorization Router
app.include_router(auth.router)


@app.get("/", tags=["Root"])
def root():
    """
    Root welcome endpoint.
    Provides quick links to Swagger UI documentation and the health check probe.
    """
    return {
        "message": f"Welcome to the {settings.app_name} API",
        "docs": "/docs",
        "health": "/health",
        "status": "running",
    }


@app.get("/health", tags=["Health"])
def health_check():
    """
    Health check endpoint to test availability of PostgreSQL and Redis.
    Returns HTTP 200 when all services are healthy, or HTTP 503 if any service fails.
    Never exposes internal error messages or stack traces to the caller.
    """
    db_status = "unavailable"
    redis_status = "unavailable"

    # Test PostgreSQL by running a fast, lightweight query
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as exc:
        # Log the full exception on the server for debugging without sending it to the client
        logger.error("PostgreSQL health check failed: %s", exc)

    # Test Redis by sending a ping command
    try:
        if redis_client.ping():
            redis_status = "connected"
    except Exception as exc:
        # Log the full exception on the server for debugging without sending it to the client
        logger.error("Redis health check failed: %s", exc)

    # Determine overall status: both services must be connected to pass
    is_healthy = (db_status == "connected") and (redis_status == "connected")

    payload = {
        "status": "healthy" if is_healthy else "unhealthy",
        "database": db_status,
        "redis": redis_status,
    }

    if not is_healthy:
        # Return 503 Service Unavailable so monitoring systems know the backend is not ready
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content=payload,
        )

    return payload
