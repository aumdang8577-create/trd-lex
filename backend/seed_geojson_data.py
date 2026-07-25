import asyncio
import json
import math
import os
import sys
from prisma import Prisma

# Ensure backend folder is in Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def utm_to_latlon(easting: float, northing: float, zone: int = 48, northern_hemisphere: bool = True):
    """
    Converts UTM projected coordinates (zone 48N) to WGS84 Latitude and Longitude.
    """
    a = 6378137.0
    e = 0.081819191
    e1sq = 0.006739497
    k0 = 0.9996

    x = easting - 500000.0
    y = northing if northern_hemisphere else northing - 10000000.0

    M = y / k0
    mu = M / (a * (1 - (e**2)/4 - 3*(e**4)/64 - 5*(e**6)/256))

    phi1 = mu + (3*e1sq/2 - 27*(e1sq**3)/32)*math.sin(2*mu) + (21*(e1sq**2)/16 - 55*(e1sq**4)/32)*math.sin(4*mu) + (151*(e1sq**3)/96)*math.sin(6*mu)

    N1 = a / math.sqrt(1 - (e**2)*(math.sin(phi1)**2))
    T1 = math.tan(phi1)**2
    C1 = e1sq * (math.cos(phi1)**2)
    R1 = a * (1 - e**2) / ((1 - (e**2)*(math.sin(phi1)**2))**1.5)
    D = x / (N1 * k0)

    lat = phi1 - (N1 * math.tan(phi1) / R1) * (
        (D**2)/2 - (5 + 3*T1 + 10*C1 - 4*(C1**2) - 9*e1sq)*(D**4)/24
        + (61 + 90*T1 + 298*C1 + 45*(T1**2) - 252*e1sq - 3*(C1**2))*(D**6)/720
    )
    lat = math.degrees(lat)

    lon0 = (zone * 6 - 183)
    lon = lon0 + math.degrees((
        D - (1 + 2*T1 + C1)*(D**3)/6
        + (5 - 2*C1 + 28*T1 - 3*(C1**2) + 8*e1sq + 24*(T1**2))*(D**5)/120
    ) / math.cos(phi1))

    return lat, lon

def create_place_polygon(lat: float, lng: float, radius_meters: float = 40.0, num_points: int = 12):
    """
    Generates a GeoJSON Polygon around center coordinate for place area visualization.
    """
    R = 6378137.0
    lat_rad = math.radians(lat)
    lng_rad = math.radians(lng)
    coordinates = []

    for i in range(num_points):
        angle = (2 * math.pi * i) / num_points
        d_lat = (radius_meters * math.cos(angle)) / R
        d_lng = (radius_meters * math.sin(angle)) / (R * math.cos(lat_rad))
        pt_lat = math.degrees(lat_rad + d_lat)
        pt_lng = math.degrees(lng_rad + d_lng)
        coordinates.append([round(pt_lng, 6), round(pt_lat, 6)])

    coordinates.append(coordinates[0]) # Close polygon ring
    return {
        "type": "Polygon",
        "coordinates": [coordinates]
    }

def get_radius_by_type(place_type: str) -> float:
    t = place_type.lower()
    if any(x in t for x in ["โรงพยาบาล", "สถานศึกษา", "ห้างสรรพสินค้า", "สวนสาธารณะ", "สนามบิน", "มหาวิทยาลัย"]):
        return 85.0
    elif any(x in t for x in ["ปั๊มน้ำมัน", "โรงแรม", "ราชการ", "ตลาด"]):
        return 55.0
    else:
        return 35.0

async def seed_geojson():
    db = Prisma()
    await db.connect()
    
    print("=== SEEDING GEOJSON DATA & PLACE POLYGONS ===")
    
    rent_paths = [
        "c:/TRD_lex/data/Rent_Land_Data_GeoJSON.json",
        "data/Rent_Land_Data_GeoJSON.json",
        "../data/Rent_Land_Data_GeoJSON.json"
    ]
    places_paths = [
        "c:/TRD_lex/data/Places_GeoJSON.json",
        "data/Places_GeoJSON.json",
        "../data/Places_GeoJSON.json"
    ]

    rent_file = next((p for p in rent_paths if os.path.exists(p)), None)
    places_file = next((p for p in places_paths if os.path.exists(p)), None)

    if not rent_file:
        print("ERROR: Rent_Land_Data_GeoJSON.json not found!")
    else:
        print(f"Loading Rent Land Data from: {rent_file}")
        with open(rent_file, "r", encoding="utf-8") as f:
            rent_data = json.load(f)
        
        features = rent_data.get("features", [])
        print(f"Found {len(features)} land parcel features.")
        
        await db.treasuryparcel.delete_many()
        print("Cleared old TreasuryParcels.")
        
        parcels_created = 0
        for feat in features:
            attrs = feat.get("attributes", {})
            geom = feat.get("geometry", {})
            rings = geom.get("rings", [])
            
            primary_key = attrs.get("PrimaryKey") or attrs.get("Land_No", f"PARCEL-{parcels_created}")
            parcel_number = attrs.get("PrimaryKey") or attrs.get("Rent_Num") or f"P-{parcels_created}"
            reg_id = attrs.get("REG_ID", "")
            rent_name = attrs.get("Rent_Name", "")
            province = attrs.get("Provice", "อุดรธานี")
            district = attrs.get("Amphoe", "เมืองอุดรธานี")
            sub_district = attrs.get("Tambon", "หมากแข้ง")
            land_plan = attrs.get("Land_Plan", "")
            building_details = attrs.get("Building", "")
            status = attrs.get("Status", "ACTIVE")
            
            area_rai = float(attrs.get("Area_Rai", 0))
            area_ngan = float(attrs.get("Area_Ngan", 0))
            area_wa = float(attrs.get("Area_Wa", 0))
            total_sqw = area_rai * 400.0 + area_ngan * 100.0 + area_wa
            
            centroid_lat = float(attrs.get("Latitude", 0.0))
            centroid_lng = float(attrs.get("Longitude", 0.0))
            
            geojson_rings = []
            for ring in rings:
                wgs84_ring = []
                for point in ring:
                    easting, northing = point[0], point[1]
                    lat, lng = utm_to_latlon(easting, northing, zone=48)
                    wgs84_ring.append([round(lng, 6), round(lat, 6)])
                geojson_rings.append(wgs84_ring)
            
            if centroid_lat == 0 or centroid_lng == 0:
                if geojson_rings and geojson_rings[0]:
                    all_lngs = [pt[0] for pt in geojson_rings[0]]
                    all_lats = [pt[1] for pt in geojson_rings[0]]
                    centroid_lng = sum(all_lngs) / len(all_lngs)
                    centroid_lat = sum(all_lats) / len(all_lats)
            
            polygon_geojson = {
                "type": "Polygon",
                "coordinates": geojson_rings
            }
            
            try:
                await db.treasuryparcel.create(
                    data={
                        "parcel_number": parcel_number,
                        "primary_key": primary_key,
                        "reg_id": reg_id,
                        "rent_name": rent_name,
                        "province": province,
                        "district": district,
                        "sub_district": sub_district,
                        "geometry_geojson": json.dumps(polygon_geojson),
                        "centroid_lat": centroid_lat,
                        "centroid_lng": centroid_lng,
                        "land_area_sqw": total_sqw if total_sqw > 0 else 100.0,
                        "land_plan": land_plan,
                        "building_details": building_details,
                        "status": status,
                        "area_rai": area_rai,
                        "area_ngan": area_ngan,
                        "area_wa": area_wa
                    }
                )
                parcels_created += 1
            except Exception as e:
                print(f"Error creating parcel {parcel_number}: {e}")

        print(f"Successfully created {parcels_created} TreasuryParcel records in DB!")

    if not places_file:
        print("ERROR: Places_GeoJSON.json not found!")
    else:
        print(f"Loading Places Data from: {places_file}")
        with open(places_file, "r", encoding="utf-8") as f:
            places_data = json.load(f)
            
        features = places_data.get("features", [])
        print(f"Found {len(features)} place features.")
        
        await db.placepoi.delete_many()
        print("Cleared old PlacePOIs.")
        
        places_created = 0
        for feat in features:
            attrs = feat.get("attributes", {})
            fid = attrs.get("FID")
            place_type = attrs.get("Type", "สถานที่สำคัญ").strip()
            name = attrs.get("Name", "").strip() or place_type
            lat = float(attrs.get("Latitude", 0.0))
            lng = float(attrs.get("Longitude", 0.0))
            
            if lat == 0 or lng == 0:
                continue
                
            radius = get_radius_by_type(place_type)
            place_polygon = create_place_polygon(lat, lng, radius_meters=radius)
            
            try:
                await db.placepoi.create(
                    data={
                        "fid": fid,
                        "place_type": place_type,
                        "name": name,
                        "latitude": lat,
                        "longitude": lng,
                        "geometry_geojson": json.dumps(place_polygon)
                    }
                )
                places_created += 1
            except Exception as e:
                print(f"Error creating place {name}: {e}")

        print(f"Successfully created {places_created} PlacePOI records with Polygons in DB!")

    await db.disconnect()
    print("=== GEOJSON SEEDING COMPLETED ===")

if __name__ == "__main__":
    import sys
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding='utf-8')
    asyncio.run(seed_geojson())
