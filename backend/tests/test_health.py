from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Verify the root endpoint returns a 200 OK status and welcome message."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "docs" in data
    assert "health" in data


def test_health_endpoint_response_structure():
    """
    Verify the /health endpoint responds with expected JSON keys.
    Even without live PostgreSQL/Redis running during local testing,
    the endpoint gracefully returns structured JSON with 503 status code.
    """
    response = client.get("/health")
    # Status code will be 200 if containers are running, or 503 if disconnected
    assert response.status_code in [200, 503]
    data = response.json()
    assert "status" in data
    assert "database" in data
    assert "redis" in data

