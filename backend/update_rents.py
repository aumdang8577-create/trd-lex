import asyncio
import os
import sys
from prisma import Prisma

# Ensure app directory is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.calculations import (
    calculate_annual_rent,
    calculate_arrangement_fee,
    LeasePurpose,
    RegionType,
    LocationClass
)

async def main():
    db = Prisma()
    await db.connect()
    
    print("Fetching all lease contracts from the database...")
    contracts = await db.leasecontract.find_many()
    print(f"Found {len(contracts)} contracts. Starting recalculation...")
    
    updated_count = 0
    
    for contract in contracts:
        # Determine parameters
        region_type = contract.region_type or ("BKK" if contract.province == "กรุงเทพมหานคร" else "PROVINCIAL")
        
        # Determine location class based on street width or land area fallback
        location_class = contract.location_class
        if not location_class:
            if contract.street_width and contract.street_width >= 6.0:
                location_class = "CLASS_1"
            elif contract.street_width and contract.street_width >= 4.0:
                location_class = "CLASS_2"
            else:
                if contract.land_area_sqw > 150.0:
                    location_class = "CLASS_1"
                elif contract.land_area_sqw > 60.0:
                    location_class = "CLASS_2"
                else:
                    location_class = "CLASS_3"
        
        # Determine lease purpose
        purpose = contract.purpose
        if not purpose:
            if contract.building_type in ["โรงงาน/คลังสินค้า", "อาคารพาณิชย์"]:
                purpose = "COMMERCIAL"
            elif contract.building_type == "ที่ดินเปล่า" and contract.land_area_sqw > 300:
                purpose = "AGRICULTURE"
            else:
                purpose = "RESIDENTIAL"
                
        # Appraisals
        appraisal_land_sqw = contract.appraisal_land_sqw or contract.land_ap or 0.0
        if appraisal_land_sqw == 0.0:
            appraisal_land_sqw = 35000.0 if region_type == "BKK" else 4000.0
            
        appraisal_bld_sqm = contract.appraisal_bld_sqm or contract.build_ap or 0.0
        if appraisal_bld_sqm == 0.0:
            appraisal_bld_sqm = 8000.0 if contract.building_type != "ที่ดินเปล่า" else None
            
        # Depreciation
        building_depreciation = contract.building_depreciation
        if building_depreciation is None:
            if contract.building_type != "ที่ดินเปล่า":
                building_depreciation = min(80.0, max(0.0, float(2026 - contract.build_year) * 2.0)) if contract.build_year else 10.0
            else:
                building_depreciation = None
                
        try:
            # Calculate rent and fee
            calculated_rent, detail = calculate_annual_rent(
                purpose=LeasePurpose(str(purpose)),
                region=RegionType(str(region_type)),
                location_class=LocationClass(str(location_class)),
                land_area_sqw=contract.land_area_sqw,
                appraisal_land_sqw=appraisal_land_sqw,
                building_type=contract.building_type,
                usable_area_sqm=contract.usable_area_sqm,
                appraisal_bld_sqm=appraisal_bld_sqm,
                building_depreciation=building_depreciation
            )
            
            calculated_arrange_fee = calculate_arrangement_fee(
                annual_rent=calculated_rent,
                purpose=LeasePurpose(str(purpose)),
                total_asset_value=detail.get("total_asset_value", 0.0),
                lease_years=contract.lease_years or 3
            )
            
            # Update contract record
            await db.leasecontract.update(
                where={"id": contract.id},
                data={
                    "region_type": str(region_type),
                    "location_class": str(location_class),
                    "purpose": str(purpose),
                    "appraisal_land_sqw": appraisal_land_sqw,
                    "appraisal_bld_sqm": appraisal_bld_sqm,
                    "building_depreciation": building_depreciation,
                    "calculated_annual_rent": calculated_rent,
                    "calculated_arrange_fee": calculated_arrange_fee,
                    "annual_rent": calculated_rent
                }
            )
            updated_count += 1
            
        except Exception as e:
            print(f"Error updating contract {contract.contract_number}: {e}")
            
    print(f"Successfully recalculated and updated {updated_count}/{len(contracts)} contracts in the database.")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
