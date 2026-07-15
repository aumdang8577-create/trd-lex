import asyncio
import json
import os
from prisma import Prisma

async def main():
    geojson_path = "C:/TRD_lex/frontend/public/maps/nongkhai_parcels.geojson"
    if not os.path.exists(geojson_path):
        print(f"Error: {geojson_path} not found. Please run process_shp.py first.")
        return

    print("Reading geojson file...")
    with open(geojson_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    features = data.get("features", [])
    print(f"Found {len(features)} features to seed.")

    db = Prisma()
    await db.connect()

    print("Clearing existing TreasuryParcels...")
    deleted = await db.treasuryparcel.delete_many()
    print(f"Deleted {deleted} old parcels.")

    print("Seeding TreasuryParcels to database...")
    batch_size = 50
    inserted_count = 0

    for i in range(0, len(features), batch_size):
        batch = features[i:i + batch_size]
        tasks = []
        for feat in batch:
            props = feat["properties"]
            geometry = feat["geometry"]
            
            # Insert record
            tasks.append(db.treasuryparcel.create(
                data={
                    "parcel_number": props["parcel_number"],
                    "province": props["province"],
                    "district": props["district"],
                    "sub_district": props["sub_district"],
                    "geometry_geojson": json.dumps(geometry),
                    "centroid_lat": props["centroid_lat"],
                    "centroid_lng": props["centroid_lng"],
                    "land_area_sqw": props["land_area_sqw"]
                }
            ))
        
        # Execute batch in parallel
        await asyncio.gather(*tasks)
        inserted_count += len(batch)
        print(f"Seeded {inserted_count}/{len(features)} parcels...")

    print("Database seeding completed successfully!")
    await db.disconnect()

if __name__ == "__main__":
    # Ensure UTF-8 output
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    asyncio.run(main())
