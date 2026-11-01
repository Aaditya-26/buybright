import uuid

from app.models import User, UserRole
from app.core.security import hash_password

PASSWORD = "Passw0rd!x"


def new_email() -> str:
    return f"user_{uuid.uuid4().hex[:8]}@buybright.com"


def register(client, email, **extra):
    body = {"email": email, "password": PASSWORD, "full_name": "Test User", **extra}
    return client.post("/auth/register", json=body)


def login(client, email, password=PASSWORD):
    return client.post("/auth/login", data={"username": email, "password": password})


def test_register_login_me_flow(client):
    email = new_email()
    r = register(client, email)
    assert r.status_code == 201
    assert r.json()["role"] == "customer"
    assert "password" not in r.json() and "password_hash" not in r.json()

    token = login(client, email).json()["access_token"]
    me = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == email


def test_client_cannot_choose_role(client):
    r = register(client, new_email(), role="admin")
    assert r.status_code == 201
    assert r.json()["role"] == "customer"


def test_duplicate_email_rejected(client):
    email = new_email()
    assert register(client, email).status_code == 201
    assert register(client, email).status_code == 409


def test_wrong_password_rejected(client):
    email = new_email()
    register(client, email)
    assert login(client, email, "WrongPass123").status_code == 401


def test_password_is_stored_hashed(client, db):
    email = new_email()
    register(client, email)
    user = db.query(User).filter_by(email=email).one()
    assert user.password_hash != PASSWORD
    assert user.password_hash.startswith("$2")


def test_me_requires_token(client):
    assert client.get("/auth/me").status_code == 401


def test_customer_blocked_from_admin_route(client):
    email = new_email()
    register(client, email)
    token = login(client, email).json()["access_token"]
    r = client.get("/auth/admin-only", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 403


def test_admin_allowed_on_admin_route(client, db):
    email = new_email()
    db.add(User(email=email, password_hash=hash_password(PASSWORD),
                full_name="Admin", role=UserRole.ADMIN))
    db.commit()
    token = login(client, email).json()["access_token"]
    r = client.get("/auth/admin-only", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200

