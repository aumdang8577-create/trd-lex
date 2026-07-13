# ==========================================
# TRD-LEX Treasury Rent and Fee Calculations
# Implements official rules from skill_cost.md
# ==========================================

from enum import Enum
from typing import Optional, Tuple, Dict, Any

class RegionType(str, Enum):
    BKK = "BKK"
    PROVINCIAL = "PROVINCIAL"

class LocationClass(str, Enum):
    CLASS_1 = "CLASS_1"
    CLASS_2 = "CLASS_2"
    CLASS_3 = "CLASS_3"

class LeasePurpose(str, Enum):
    RESIDENTIAL = "RESIDENTIAL"
    AGRICULTURE = "AGRICULTURE"
    COMMERCIAL = "COMMERCIAL"

class TransferType(str, Enum):
    GENERAL = "GENERAL"
    FAMILY = "FAMILY"
    CO_LESSEE = "CO_LESSEE"

# Table A: Bangkok Residential Rent Rates (Baht / Sqw / Month)
# Format: (min_appraisal, max_appraisal, class_1, class_2, class_3)
TABLE_A_RATES = [
    (0, 1000, 2.50, 1.50, 0.50),
    (1001, 2000, 3.00, 2.00, 1.00),
    (2001, 3000, 3.50, 2.50, 1.50),
    (3001, 5000, 4.50, 3.00, 2.00),
    (5001, 10000, 6.00, 3.50, 2.50),
    (10001, 20000, 8.00, 4.50, 3.00),
    (20001, 30000, 10.00, 6.00, 3.50),
    (30001, 40000, 12.00, 8.00, 4.50),
    (40001, 50000, 14.00, 10.00, 6.00),
    (50001, 60000, 16.00, 12.00, 8.00),
    (60001, 70000, 18.00, 14.00, 10.00),
    (70001, 80000, 20.00, 16.00, 12.00),
    (80001, 90000, 22.00, 18.00, 14.00),
    (90001, 100000, 24.00, 20.00, 16.00),
    (100001, 110000, 26.00, 22.00, 18.00),
    (110001, 120000, 28.00, 24.00, 20.00),
    (120001, 130000, 30.00, 26.00, 22.00),
    (130001, 140000, 32.00, 28.00, 24.00),
    (140001, 150000, 34.00, 30.00, 26.00),
    (150001, 160000, 36.00, 32.00, 28.00),
    (160001, 170000, 38.00, 34.00, 30.00),
    (170001, 180000, 40.00, 36.00, 32.00),
    (180001, 190000, 42.00, 38.00, 34.00),
    (190001, 200000, 44.00, 40.00, 36.00),
    (200001, 210000, 46.00, 42.00, 38.00),
    (210001, 220000, 48.00, 44.00, 40.00),
    (220001, 230000, 50.00, 46.00, 42.00),
    (230001, 240000, 52.00, 48.00, 44.00),
    (240001, 250000, 54.00, 50.00, 46.00),
    (250001, 260000, 56.00, 52.00, 48.00),
    (260001, 270000, 58.00, 54.00, 50.00),
    (270001, 280000, 60.00, 56.00, 52.00),
    (280001, 290000, 62.00, 58.00, 54.00),
    (290001, 300000, 64.00, 60.00, 56.00)
]

# Table B: Provincial Residential Rent Rates (Baht / Sqw / Month)
TABLE_B_RATES = [
    (0, 500, 1.00, 0.50, 0.25),
    (501, 1000, 1.25, 0.75, 0.40),
    (1001, 2000, 1.50, 1.00, 0.50),
    (2001, 3000, 2.00, 1.25, 0.75),
    (3001, 5000, 3.00, 1.50, 1.00),
    (5001, 10000, 4.50, 2.00, 1.25),
    (10001, 20000, 6.00, 3.00, 1.50),
    (20001, 30000, 8.00, 4.50, 2.00),
    (30001, 40000, 10.00, 6.00, 3.00),
    (40001, 50000, 12.00, 8.00, 4.50),
    (50001, 60000, 14.00, 10.00, 6.00),
    (60001, 70000, 16.00, 12.00, 8.00),
    (70001, 80000, 18.00, 14.00, 10.00),
    (80001, 90000, 20.00, 16.00, 12.00),
    (90001, 100000, 22.00, 18.00, 14.00)
]


def lookup_table_rate(appraisal: float, table: list, location_class: LocationClass) -> float:
    for min_val, max_val, c1, c2, c3 in table:
        if min_val <= appraisal <= max_val:
            if location_class == LocationClass.CLASS_1:
                return c1
            elif location_class == LocationClass.CLASS_2:
                return c2
            else:
                return c3
    # Default fallback if table lookup fails but within bounds
    return table[-1][2] if location_class == LocationClass.CLASS_1 else (table[-1][3] if location_class == LocationClass.CLASS_2 else table[-1][4])


def calculate_annual_rent(
    purpose: LeasePurpose,
    region: RegionType,
    location_class: LocationClass,
    land_area_sqw: float,
    appraisal_land_sqw: float,
    building_type: Optional[str] = None,
    usable_area_sqm: Optional[float] = None,
    appraisal_bld_sqm: Optional[float] = None,
    building_depreciation: Optional[float] = None,
) -> Tuple[float, Dict[str, Any]]:
    """
    Calculates estimated annual rent based on official Treasury Department rules.
    Returns: (annual_rent, detail_dict)
    """
    detail = {}
    
    # Calculate asset base values
    land_value = land_area_sqw * appraisal_land_sqw
    detail["land_value"] = land_value
    
    building_value = 0.0
    if building_type and building_type != "ที่ดินเปล่า" and usable_area_sqm and usable_area_sqm > 0:
        bld_rate = appraisal_bld_sqm or 8000.0 # fallback rate
        dep = building_depreciation or 0.0
        building_value = usable_area_sqm * bld_rate * (1.0 - dep / 100.0)
    detail["building_value"] = building_value
    
    total_asset_value = land_value + building_value
    detail["total_asset_value"] = total_asset_value

    if purpose == LeasePurpose.RESIDENTIAL:
        # Residential calculations (Document 1)
        if region == RegionType.BKK:
            if appraisal_land_sqw <= 300000.0:
                rate = lookup_table_rate(appraisal_land_sqw, TABLE_A_RATES, location_class)
                monthly_rent = max(0.50 * land_area_sqw, rate * land_area_sqw)
                annual_rent = monthly_rent * 12.0
                detail["method"] = "Residential BKK (Table A Lookup)"
                detail["rate_per_sqw_month"] = rate
            else:
                # Exceeds 300,000: 1% of asset value per year
                annual_rent = total_asset_value * 0.01
                detail["method"] = "Residential BKK (1% of Asset Value)"
        else: # PROVINCIAL
            if appraisal_land_sqw <= 100000.0:
                rate = lookup_table_rate(appraisal_land_sqw, TABLE_B_RATES, location_class)
                monthly_rent = max(0.25 * land_area_sqw, rate * land_area_sqw)
                annual_rent = monthly_rent * 12.0
                detail["method"] = "Residential Provincial (Table B Lookup)"
                detail["rate_per_sqw_month"] = rate
            else:
                # Exceeds 100,000: 1% of asset value per year
                annual_rent = total_asset_value * 0.01
                detail["method"] = "Residential Provincial (1% of Asset Value)"
                
    elif purpose == LeasePurpose.AGRICULTURE:
        # Agriculture calculations (Document 2)
        price_per_rai = appraisal_land_sqw * 400.0
        area_in_rai = land_area_sqw / 400.0
        
        if price_per_rai <= 8000000.0:
            if area_in_rai <= 15.0:
                # Flat rate 200 baht per rai per year, min 200
                annual_rent = max(200.0, area_in_rai * 200.0)
                detail["method"] = "Agriculture <= 15 Rai Flat Rate (200 Baht/Rai)"
            else:
                # First 15 rai is 3000, exceeding is 0.2% of land value of the exceeding area
                base_part = 15.0 * 200.0 # 3000
                exceeding_sqw = land_area_sqw - 6000.0
                exceeding_value = exceeding_sqw * appraisal_land_sqw
                exceeding_rent = exceeding_value * 0.002
                annual_rent = base_part + exceeding_rent
                detail["method"] = "Agriculture > 15 Rai (3,000 Baht + 0.2% of Exceeding Land Value)"
                detail["exceeding_value"] = exceeding_value
        else:
            # Exceeds 8M per rai: 0.2% of total land value per year
            annual_rent = land_value * 0.002
            detail["method"] = "Agriculture Price > 8M/Rai (0.2% of Land Value)"
            
    elif purpose == LeasePurpose.COMMERCIAL:
        # Commercial calculations (Document 3 & 4)
        if building_type == "BOT":
            # BOT projects: 2% of asset value per year
            annual_rent = total_asset_value * 0.02
            detail["method"] = "Commercial BOT (2% of Asset Value)"
        elif building_type and building_type != "ที่ดินเปล่า":
            # Land with building: 3% of total asset value per year
            annual_rent = total_asset_value * 0.03
            detail["method"] = "Commercial Land with Building (3% of Asset Value)"
        else:
            # Vacant land commercial: first 12 sqw flat rate, exceeding is 3% of exceeding asset value per year
            flat_rate_monthly = 670.0 if region == RegionType.BKK else 470.0
            min_monthly = 4000.0 if region == RegionType.BKK else 2800.0
            
            if land_area_sqw <= 12.0:
                annual_rent = max(min_monthly, land_area_sqw * flat_rate_monthly) * 12.0
                detail["method"] = f"Commercial Land <= 12 Sqw Flat Rate ({flat_rate_monthly} Baht/Sqw/Month)"
            else:
                base_annual_rent = max(min_monthly, 12.0 * flat_rate_monthly) * 12.0
                exceeding_sqw = land_area_sqw - 12.0
                exceeding_value = exceeding_sqw * appraisal_land_sqw
                exceeding_rent = exceeding_value * 0.03
                annual_rent = base_annual_rent + exceeding_rent
                detail["method"] = f"Commercial Land > 12 Sqw (12 Sqw Flat Rate + 3% of Exceeding Land Value)"
                detail["exceeding_value"] = exceeding_value
                
    else:
        # Default safety fallback
        annual_rent = land_value * 0.01
        detail["method"] = "Standard 1% Land Value Fallback"

    # Rule 23.1: Round rent to nearest 1 Baht
    rounded_rent = round(annual_rent)
    return float(rounded_rent), detail


def calculate_transfer_fee(
    annual_rent: float,
    transfer_type: TransferType,
    transfer_share: float = 100.0
) -> Tuple[float, float, str]:
    """
    Calculates official lease transfer fee.
    Returns: (base_fee, final_fee, description)
    """
    # Rule 3.1: 6 times of annual rent
    base_fee = annual_rent * 6.0
    
    if transfer_type == TransferType.FAMILY:
        # Rule 3.3: 25% of standard fee (75% discount)
        final_fee = base_fee * 0.25
        desc = "ได้รับสิทธิลดหย่อนร้อยละ 75 (โอนให้ทายาท/บุพการี/คู่สมรส)"
    elif transfer_type == TransferType.CO_LESSEE:
        # Rule 3.2: proportional transfer
        ratio = max(1.0, min(100.0, transfer_share)) / 100.0
        final_fee = base_fee * ratio
        desc = f"คิดตามสัดส่วนสิทธิที่โอน ({transfer_share}%) ระหว่างผู้เช่าร่วม"
    else:
        final_fee = base_fee
        desc = "คิดอัตราปกติ (6 เท่าของค่าเช่ารายปี)"
        
    # Rule 23.2: Round fees to nearest 10 Baht
    rounded_base = float(round(base_fee / 10.0) * 10)
    rounded_final = float(round(final_fee / 10.0) * 10)
    
    return rounded_base, rounded_final, desc


def calculate_arrangement_fee(
    annual_rent: float,
    purpose: LeasePurpose,
    total_asset_value: float,
    lease_years: int = 3
) -> float:
    """
    Calculates estimated arrangement fee.
    - Residential/Agriculture: 2 times of annual rent.
    - Commercial: 1% of asset value per year.
    Returns: arrangement_fee (rounded to nearest 10 Baht per Rule 23.2)
    """
    if purpose == LeasePurpose.COMMERCIAL:
        fee = total_asset_value * 0.01 * lease_years
    else:
        fee = annual_rent * 2.0
        
    return float(round(fee / 10.0) * 10)
