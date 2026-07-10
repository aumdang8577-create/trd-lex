import pytest
import pytest_asyncio
from httpx import AsyncClient
from app.core.database import db

@pytest_asyncio.fixture
async def auth_headers(client: AsyncClient):
    """Helper fixture to log in a user and return authorization headers."""
    response = await client.post("/auth/login", json={"thaid_id": "1123456789012"})
    assert response.status_code == 200
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.asyncio
async def test_validate_contract_not_found(client: AsyncClient, auth_headers: dict):
    # Test logging in and validating a non-existent contract
    response = await client.post(
        "/contracts/validate",
        json={"contract_number": "TRD-NON-EXIST"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is False
    assert "ไม่พบข้อมูลสัญญาเช่า" in data["message"]

@pytest.mark.asyncio
async def test_validate_contract_success(client: AsyncClient, auth_headers: dict):
    # Seed a contract belonging to the user
    await db.leasecontract.create(
        data={
            "contract_number": "TRD-TEST-SUCCESS",
            "lessee_thaid_id": "1123456789012",
            "parcel_number": "กท.1111",
            "location_lat": 13.75,
            "location_lng": 100.5,
            "province": "กรุงเทพมหานคร",
            "district": "ดินแดง",
            "sub_district": "ดินแดง",
            "land_area_sqw": 40.0,
            "is_active": True
        }
    )
    
    response = await client.post(
        "/contracts/validate",
        json={"contract_number": "TRD-TEST-SUCCESS"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is True
    assert data["contract_data"]["parcel_number"] == "กท.1111"
    assert data["contract_data"]["province"] == "กรุงเทพมหานคร"

@pytest.mark.asyncio
async def test_validate_contract_not_active(client: AsyncClient, auth_headers: dict):
    # Seed an inactive contract belonging to the user
    await db.leasecontract.create(
        data={
            "contract_number": "TRD-TEST-INACTIVE",
            "lessee_thaid_id": "1123456789012",
            "parcel_number": "กท.2222",
            "location_lat": 13.75,
            "location_lng": 100.5,
            "province": "กรุงเทพมหานคร",
            "district": "ดินแดง",
            "sub_district": "ดินแดง",
            "land_area_sqw": 40.0,
            "is_active": False
        }
    )
    
    response = await client.post(
        "/contracts/validate",
        json={"contract_number": "TRD-TEST-INACTIVE"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is False
    assert "ถูกระงับการใช้งาน" in data["message"]

@pytest.mark.asyncio
async def test_validate_contract_wrong_owner(client: AsyncClient, auth_headers: dict):
    # Seed a contract belonging to a different user
    await db.leasecontract.create(
        data={
            "contract_number": "TRD-TEST-WRONG-OWNER",
            "lessee_thaid_id": "9923456789012",
            "parcel_number": "กท.3333",
            "location_lat": 13.75,
            "location_lng": 100.5,
            "province": "กรุงเทพมหานคร",
            "district": "ดินแดง",
            "sub_district": "ดินแดง",
            "land_area_sqw": 40.0,
            "is_active": True
        }
    )
    
    response = await client.post(
        "/contracts/validate",
        json={"contract_number": "TRD-TEST-WRONG-OWNER"},
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["is_valid"] is False
    assert "ไม่ได้ลงทะเบียนภายใต้เลขบัตรประชาชนของคุณ" in data["message"]
