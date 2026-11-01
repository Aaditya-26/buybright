import getpass

from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import User, UserRole


def main() -> None:
    email = input("Admin email: ").strip().lower()
    password = getpass.getpass("Admin password (8 to 64 characters): ")
    if not 8 <= len(password) <= 64:
        raise SystemExit("Password must be 8 to 64 characters.")

    with SessionLocal() as db:
        if db.scalar(select(User).where(User.email == email)):
            raise SystemExit("A user with this email already exists.")
        db.add(User(
            email=email,
            password_hash=hash_password(password),
            full_name="Platform Admin",
            role=UserRole.ADMIN,
        ))
        db.commit()
    print("Admin created.")


if __name__ == "__main__":
    main()

