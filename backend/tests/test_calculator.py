import pytest
from httpx import AsyncClient
from app.core.database import db

@pytest.mark.asyncio
async def test_calculate_general_fee(client: AsyncClient):
    response = await client.post(
        "/calculator/transfer-fee",
        json={
            "annual_rent": 10000.0,
            "transfer_type": "GENERAL",
            "contract_number": "TRD-CALC-1"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["annual_rent"] == 10000.0
    assert data["base_fee"] == 60000.0
    assert data["final_fee"] == 60000.0
    assert "อัตราปกติ" in data["discount_description"]

    # Verify log in database
    log = await db.feecalculationlog.find_first(
        where={"contract_number": "TRD-CALC-1"}
    )
    assert log is not None
    assert log.calculated_fee == 60000.0
    assert log.transfer_type == "GENERAL"

@pytest.mark.asyncio
async def test_calculate_family_fee(client: AsyncClient):
    response = await client.post(
        "/calculator/transfer-fee",
        json={
            "annual_rent": 20000.0,
            "transfer_type": "FAMILY",
            "contract_number": "TRD-CALC-2"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["base_fee"] == 120000.0
    assert data["final_fee"] == 30000.0  # 120000 * 0.25
    assert "ลดหย่อนร้อยละ 75" in data["discount_description"]

    # Verify log in database
    log = await db.feecalculationlog.find_first(
        where={"contract_number": "TRD-CALC-2"}
    )
    assert log is not None
    assert log.calculated_fee == 30000.0
    assert log.transfer_type == "FAMILY"

@pytest.mark.asyncio
async def test_calculate_colessee_fee(client: AsyncClient):
    response = await client.post(
        "/calculator/transfer-fee",
        json={
            "annual_rent": 30000.0,
            "transfer_type": "CO_LESSEE",
            "transfer_share": 40.0,
            "contract_number": "TRD-CALC-3"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["base_fee"] == 180000.0
    assert data["final_fee"] == 72000.0  # 180000 * 0.4
    assert "40.0%" in data["discount_description"]

    # Verify log in database
    log = await db.feecalculationlog.find_first(
        where={"contract_number": "TRD-CALC-3"}
    )
    assert log is not None
    assert log.calculated_fee == 72000.0
    assert log.transfer_type == "CO_LESSEE"

@pytest.mark.asyncio
async def test_calculate_colessee_missing_share(client: AsyncClient):
    # If transfer_type is CO_LESSEE but transfer_share is omitted (None)
    response = await client.post(
        "/calculator/transfer-fee",
        json={
            "annual_rent": 30000.0,
            "transfer_type": "CO_LESSEE",
            "transfer_share": None
        }
    )
    # Pydantic validation should fail
    assert response.status_code == 422
