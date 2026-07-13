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

@pytest.mark.asyncio
async def test_calculate_detailed_residential_bkk(client: AsyncClient):
    response = await client.post(
        "/calculator/transfer-fee",
        json={
            "transfer_type": "GENERAL",
            "contract_number": "TRD-DET-1",
            "lease_purpose": "RESIDENTIAL",
            "region_type": "BKK",
            "location_class": "CLASS_1",
            "land_area_sqw": 50.0,
            "appraisal_land_sqw": 25000.0,  # <= 300,000 lookup
        }
    )
    assert response.status_code == 200
    data = response.json()
    # 25000 is between 20001 and 30000 -> Table A class 1 rate is 10.00
    # Rent = 50 * 10 * 12 = 6,000
    # Base fee = 6,000 * 6 = 36,000
    assert data["annual_rent"] == 6000.0
    assert data["base_fee"] == 36000.0
    assert data["calculated_arrangement_fee"] == 12000.0  # 2 * annual rent

@pytest.mark.asyncio
async def test_calculate_detailed_agriculture(client: AsyncClient):
    response = await client.post(
        "/calculator/transfer-fee",
        json={
            "transfer_type": "GENERAL",
            "contract_number": "TRD-DET-2",
            "lease_purpose": "AGRICULTURE",
            "region_type": "PROVINCIAL",
            "location_class": "CLASS_3",
            "land_area_sqw": 2000.0,  # 5 rai
            "appraisal_land_sqw": 1000.0,  # land value per rai = 400k (<= 8M)
        }
    )
    assert response.status_code == 200
    data = response.json()
    # 5 rai <= 15 rai, rent is 5 * 200 = 1000 baht
    # Base fee = 1000 * 6 = 6000
    assert data["annual_rent"] == 1000.0
    assert data["base_fee"] == 6000.0

@pytest.mark.asyncio
async def test_calculate_detailed_commercial(client: AsyncClient):
    response = await client.post(
        "/calculator/transfer-fee",
        json={
            "transfer_type": "GENERAL",
            "contract_number": "TRD-DET-3",
            "lease_purpose": "COMMERCIAL",
            "region_type": "BKK",
            "location_class": "CLASS_2",
            "land_area_sqw": 20.0,  # > 12 sqw
            "appraisal_land_sqw": 50000.0,
        }
    )
    assert response.status_code == 200
    data = response.json()
    # First 12 sqw flat rate = 670 * 12 * 12 = 96480 per year (min 4000*12=48000 per year)
    # Exceeding area = 8 sqw. Land value = 8 * 50000 = 400,000. 3% of exceeding is 12,000 per year.
    # Total rent = 96480 + 12000 = 108480.
    assert data["annual_rent"] == 108480.0

