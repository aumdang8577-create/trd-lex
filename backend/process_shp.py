import shapefile
import utm
import json
import os

def calculate_area_sqm(points):
    n = len(points)
    area = 0.0
    for i in range(n):
        j = (i + 1) % n
        area += points[i][0] * points[j][1]
        area -= points[j][0] * points[i][1]
    return abs(area) / 2.0

def convert_points(points):
    wgs_points = []
    for p in points:
        try:
            # UTM zone for Nong Khai is 48N
            lat, lon = utm.to_latlon(p[0], p[1], 48, northern=True)
            wgs_points.append([lon, lat])  # GeoJSON uses [lng, lat]
        except Exception as e:
            # fallback or skip invalid coords
            pass
    return wgs_points

def main():
    shp_path = "C:/TRD_lex/ShapeNongkhy.shp"
    if not os.path.exists(shp_path):
        print(f"Error: {shp_path} not found.")
        return

    print("Opening shapefile...")
    sf = shapefile.Reader(shp=open(shp_path, "rb"))
    shapes = sf.shapes()
    print(f"Found {len(shapes)} shapes.")

    features = []
    for idx, shape in enumerate(shapes, start=1):
        if len(shape.points) == 0:
            continue
        
        # Calculate area using UTM points
        parts = list(shape.parts) + [len(shape.points)]
        area_sqm = 0.0
        rings = []
        
        for i in range(len(shape.parts)):
            ring_points = shape.points[parts[i]:parts[i+1]]
            ring_area = calculate_area_sqm(ring_points)
            if i == 0:
                area_sqm += ring_area
            else:
                area_sqm -= ring_area
            
            # Convert points to WGS84
            converted_ring = convert_points(ring_points)
            if converted_ring:
                rings.append(converted_ring)
        
        if not rings:
            continue
            
        # Calculate centroid in UTM
        utm_xs = [p[0] for p in shape.points]
        utm_ys = [p[1] for p in shape.points]
        centroid_utm_x = sum(utm_xs) / len(utm_xs)
        centroid_utm_y = sum(utm_ys) / len(utm_ys)
        
        # Convert centroid to WGS84
        try:
            c_lat, c_lon = utm.to_latlon(centroid_utm_x, centroid_utm_y, 48, northern=True)
        except:
            c_lat, c_lon = 17.8783, 102.7412 # fallback to Nong Khai city
            
        area_sqw = round(area_sqm / 4.0, 2)
        parcel_num = f"นค.{1000 + idx}"
        
        feature = {
            "type": "Feature",
            "id": f"parcel_{idx}",
            "properties": {
                "parcel_id": f"parcel_{idx}",
                "parcel_number": parcel_num,
                "province": "หนองคาย",
                "district": "เมืองหนองคาย",
                "sub_district": "ในเมือง",
                "land_area_sqw": area_sqw,
                "centroid_lat": c_lat,
                "centroid_lng": c_lon
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": rings
            }
        }
        features.append(feature)

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    # Save to frontend maps directory
    output_dir = "C:/TRD_lex/frontend/public/maps"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "nongkhai_parcels.geojson")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully wrote {len(features)} parcels to {output_path}")

if __name__ == "__main__":
    main()
