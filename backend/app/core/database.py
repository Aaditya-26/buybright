from collections.abc import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

# Create the SQLAlchemy engine to manage connections to PostgreSQL
# pool_pre_ping=True tests every connection with a ping before using it, preventing stale connections
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
)

# Factory that generates new database sessions for incoming HTTP requests
# autoflush=False avoids sending unwanted early SQL queries before commit
# expire_on_commit=False keeps object attributes accessible after transaction commits
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    expire_on_commit=False,
)


# SQLAlchemy 2.0 declarative base class from which all database models will inherit
class Base(DeclarativeBase):
    pass


# Generator function used as a FastAPI dependency to manage database session lifecycle
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        # Provide the active database session to the API endpoint
        yield db
    finally:
        # Always close session when request finishes to return connection back to pool
        db.close()

