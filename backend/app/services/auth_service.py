from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.redis_client import redis_client
from app.core.security import hash_password, verify_password
from app.models import User, UserRole
from app.schemas.auth import RegisterRequest

MAX_FAILED_LOGINS = 5
LOCK_SECONDS = 15 * 60


def register_customer(db: Session, data: RegisterRequest) -> User:
    email = data.email.lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")

    user = User(
        email=email,
        password_hash=hash_password(data.password),
        full_name=data.full_name.strip(),
        phone=data.phone,
        role=UserRole.CUSTOMER,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:  # two requests raced; the DB unique constraint wins
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    db.refresh(user)
    return user


def authenticate(db: Session, email: str, password: str) -> User:
    email = email.lower()
    fail_key = f"login_fail:{email}"

    failed = redis_client.get(fail_key)
    if failed and int(failed) >= MAX_FAILED_LOGINS:
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS,
            "Too many failed attempts. Try again in 15 minutes.",
        )

    user = db.scalar(select(User).where(User.email == email))
    if user is None or not verify_password(password, user.password_hash):
        pipe = redis_client.pipeline()
        pipe.incr(fail_key)
        pipe.expire(fail_key, LOCK_SECONDS)
        pipe.execute()
        # Same message for unknown email and wrong password, on purpose.
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")

    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account is disabled")

    redis_client.delete(fail_key)
    return user

