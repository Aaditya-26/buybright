import redis

from app.core.config import settings

# Create a reusable Redis client from the connection URL in settings
# decode_responses=True converts byte responses from Redis into standard Python strings automatically
redis_client = redis.Redis.from_url(
    settings.redis_url,
    decode_responses=True,
)


def get_redis() -> redis.Redis:
    """Dependency helper to inject the shared Redis client into endpoints and services."""
    return redis_client

