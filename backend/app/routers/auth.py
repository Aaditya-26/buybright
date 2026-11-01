from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.deps import get_current_user, get_db, require_roles
from app.models import User, UserRole
from app.schemas.auth import RegisterRequest, TokenOut, UserOut
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    return auth_service.register_customer(db, data)


@router.post("/login", response_model=TokenOut)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Swagger's Authorize button sends the email in the "username" field.
    user = auth_service.authenticate(db, form.username, form.password)
    return TokenOut(access_token=create_access_token(user.id))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.get("/admin-only", tags=["Auth"])  # temporary: proves role guards work
def admin_only(user: User = Depends(require_roles(UserRole.ADMIN))):
    return {"message": f"Hello admin {user.full_name}"}

