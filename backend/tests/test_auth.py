import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_login_success_mock_citizen(client: AsyncClient):
    # Test logging in with a valid mock ID
    response = await client.post("/auth/login", json={"thaid_id": "1123456789012"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["thaid_id"] == "1123456789012"
    assert data["user"]["first_name"] == "สมชาย"

@pytest.mark.asyncio
async def test_login_success_new_citizen(client: AsyncClient):
    # Test logging in with a new citizen ID
    response = await client.post("/auth/login", json={"thaid_id": "4123456789012"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["thaid_id"] == "4123456789012"
    
    # Verify that the user was created in the database
    from app.core.database import db
    user = await db.user.find_unique(where={"thaid_id": "4123456789012"})
    assert user is not None
    assert user.first_name == "ผู้ใช้จำลอง"

@pytest.mark.asyncio
async def test_login_invalid_id_format(client: AsyncClient):
    # Test logging in with an invalid ID (non-digits)
    response = await client.post("/auth/login", json={"thaid_id": "1123456789abc"})
    assert response.status_code == 400
    assert response.json()["detail"] == "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลักเท่านั้น"

    # Test logging in with an ID that is too short (12 digits)
    response_short = await client.post("/auth/login", json={"thaid_id": "112345678901"})
    assert response_short.status_code == 422

    # Test logging in with an ID that is too long (14 digits)
    response_long = await client.post("/auth/login", json={"thaid_id": "11234567890123"})
    assert response_long.status_code == 422
