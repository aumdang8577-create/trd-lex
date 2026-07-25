# cspell:ignore placepoi
import json
from typing import List, Optional
from fastapi import APIRouter, Query
from app.core.database import db

router = APIRouter(prefix="/places", tags=["Nearby Places / POIs"])

@router.get("")
async def get_places(
    place_type: Optional[str] = Query(None, description="กรองตามประเภทสถานที่ เช่น ปั๊มน้ำมัน, ร้านสะดวกซื้อ, ธนาคาร")
):
    """
    ดึงรายการสถานที่สำคัญรอบแปลงที่ดิน (POIs) พร้อมรูปแปลง Polygon บริเวณสถานที่
    """
    where_clause = {}
    if place_type:
        where_clause["place_type"] = place_type

    places = await db.placepoi.find_many(
        where=where_clause if where_clause else None
    )

    result = []
    for p in places:
        geometry = None
        if p.geometry_geojson:
            try:
                geometry = json.loads(p.geometry_geojson)
            except Exception:
                geometry = None

        result.append({
            "id": p.id,
            "fid": p.fid,
            "place_type": p.place_type,
            "name": p.name,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "geometry": geometry
        })

    return result

