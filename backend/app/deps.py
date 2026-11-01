"""
Shared FastAPI dependency providers for BuyBright.
Endpoints and routers can import get_db and get_redis from here or directly from app.core.
"""
from collections.abc import Generator
from sqlalchemy.orm import Session
import redis

from app.core.database import get_db
from app.core.redis_client import get_redis

__all__ = ["get_db", "get_redis"]

