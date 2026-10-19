import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
import uuid

@pytest.mark.asyncio
async def test_auth_workflow_and_security():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Health check
        health_resp = await client.get("/api/health")
        assert health_resp.status_code == 200
        assert health_resp.json()["status"] == "healthy"

        # Unique email for testing
        test_email = f"student_{uuid.uuid4().hex[:6]}@keeplearning.io"
        password = "SecurePassword123!"

        # 2. Valid Registration
        reg_resp = await client.post("/api/auth/register", json={
            "full_name": "Test Student",
            "email": test_email,
            "password": password
        })
        assert reg_resp.status_code == 201, reg_resp.text
        data = reg_resp.json()
        assert "access_token" in data
        assert data["user"]["email"] == test_email
        assert data["user"]["name"] == "Test Student"
        token = data["access_token"]

        # 3. Duplicate Email Registration (Must fail with 409)
        dup_resp = await client.post("/api/auth/register", json={
            "full_name": "Duplicate Student",
            "email": test_email,
            "password": "AnotherPassword456!"
        })
        assert dup_resp.status_code == 409

        # 4. Valid Login
        login_resp = await client.post("/api/auth/login", json={
            "email": test_email,
            "password": password
        })
        assert login_resp.status_code == 200
        login_data = login_resp.json()
        assert "access_token" in login_data
        assert login_data["user"]["email"] == test_email

        # 5. Invalid Password Login (Must fail with 401)
        bad_login = await client.post("/api/auth/login", json={
            "email": test_email,
            "password": "WrongPassword!"
        })
        assert bad_login.status_code == 401

        # 6. Protected /api/auth/me with valid Bearer token
        me_resp = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert me_resp.status_code == 200
        me_data = me_resp.json()
        assert me_data["email"] == test_email
        assert "passwordHash" not in me_data

        # 7. Protected /api/auth/me without token (Must fail with 401)
        unauth_resp = await client.get("/api/auth/me")
        assert unauth_resp.status_code == 401
