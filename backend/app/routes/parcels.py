# cspell:ignore treasuryparcel
from typing import List, Optional
from fastapi import APIRouter, Query
from app.core.database import db
import json

router = APIRouter(prefix="/parcels", tags=["Treasury Parcels"])

@router.get("")
async def get_parcels(
    province: Optional[str] = Query(None, description="กรองตามจังหวัด"),
    district: Optional[str] = Query(None, description="กรองตามอำเภอ")
):
    """
    ดึงรายการแปลงที่ดินราชพัสดุพร้อมรูปแปลง GeoJSON
    """
    where_clause = {}
    if province:
        where_clause["province"] = province
    if district:
        where_clause["district"] = district

    parcels = await db.treasuryparcel.find_many(
        where=where_clause if where_clause else None
    )

    result = []
    for p in parcels:
        geometry = None
        if p.geometry_geojson:
            try:
                geometry = json.loads(p.geometry_geojson)
            except Exception:
                geometry = None

        result.append({
            "id": p.id,
            "parcel_number": p.parcel_number,
            "primary_key": p.primary_key,
            "reg_id": p.reg_id,
            "rent_name": p.rent_name,
            "province": p.province,
            "district": p.district,
            "sub_district": p.sub_district,
            "geometry": geometry,
            "centroid_lat": p.centroid_lat,
            "centroid_lng": p.centroid_lng,
            "land_area_sqw": p.land_area_sqw,
            "land_plan": p.land_plan,
            "building_details": p.building_details,
            "status": p.status,
            "area_rai": p.area_rai,
            "area_ngan": p.area_ngan,
            "area_wa": p.area_wa
        })

    return result
