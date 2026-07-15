import xml.etree.ElementTree as ET
import json
import os

def calculate_centroid(coords):
    if not coords:
        return 0.0, 0.0
    lats = [c[1] for c in coords]
    lngs = [c[0] for c in coords]
    return sum(lats) / len(lats), sum(lngs) / len(lngs)

def parse_coordinates(coords_text):
    coords_list = []
    for coord in coords_text.strip().split():
        parts = coord.split(",")
        if len(parts) >= 2:
            try:
                lng, lat = float(parts[0]), float(parts[1])
                coords_list.append([lng, lat])
            except ValueError:
                pass
    return coords_list

def main():
    kml_path = "C:/TRD_lex/land_kanjanaburiwgs47.kml"
    output_geojson_path = "C:/TRD_lex/frontend/public/maps/kanjanaburi_parcels.geojson"
    
    if not os.path.exists(kml_path):
        print(f"Error: {kml_path} not found.")
        return
        
    print("Parsing Kanchanaburi KML...")
    tree = ET.parse(kml_path)
    root = tree.getroot()
    
    ns = {"kml": "http://www.opengis.net/kml/2.2"}
    placemarks = root.findall(".//kml:Placemark", ns)
    print(f"Found {len(placemarks)} placemarks.")
    
    raw_parcels = []
    
    for idx, pm in enumerate(placemarks):
        # Extract name
        name_elem = pm.find("kml:name", ns)
        name = name_elem.text if name_elem is not None else f"KML_{idx}"
        
        # Extract properties from SimpleData
        simple_data_elems = pm.findall(".//kml:SimpleData", ns)
        props = {}
        for sde in simple_data_elems:
            props[sde.attrib["name"]] = sde.text
            
        short_prov = props.get("SHORT_PROV", "กจ")
        reg_num = props.get("REG_NUM", "")
        if not reg_num and name.startswith(short_prov):
            reg_num = name[len(short_prov):]
            
        parcel_number = f"{short_prov}.{reg_num}"
        
        province = "กาญจนบุรี"
        district = props.get("AMPH_NAME", "")
        sub_district = props.get("TUMB_NAME", "")
        
        # Area calculation from Rai, Ngan, Sqw
        try:
            area1 = float(props.get("LAND_AREA1", 0) or 0)
            area2 = float(props.get("LAND_AREA2", 0) or 0)
            area3 = float(props.get("LAND_AREA3", 0) or 0)
            land_area_sqw = area1 * 400.0 + area2 * 100.0 + area3
        except Exception:
            land_area_sqw = 0.0
            
        # Parse geometries
        polygons = []
        polygon_elems = pm.findall(".//kml:Polygon", ns)
        for poly_elem in polygon_elems:
            outer_ring = poly_elem.find(".//kml:outerBoundaryIs//kml:coordinates", ns)
            if outer_ring is not None and outer_ring.text:
                outer_coords = parse_coordinates(outer_ring.text)
                if outer_coords:
                    rings = [outer_coords]
                    inner_rings = poly_elem.findall(".//kml:innerBoundaryIs//kml:coordinates", ns)
                    for inner in inner_rings:
                        if inner.text:
                            inner_coords = parse_coordinates(inner.text)
                            if inner_coords:
                                rings.append(inner_coords)
                    polygons.append(rings)
        
        if not polygons:
            continue
            
        raw_parcels.append({
            "parcel_number": parcel_number,
            "province": province,
            "district": district,
            "sub_district": sub_district,
            "land_area_sqw": land_area_sqw,
            "polygons": polygons
        })
        
    # Group and merge duplicates
    grouped = {}
    for item in raw_parcels:
        pnum = item["parcel_number"]
        if pnum not in grouped:
            grouped[pnum] = []
        grouped[pnum].append(item)
        
    features = []
    for pnum, items in grouped.items():
        # First item is primary
        primary = items[0]
        
        # Merge all polygons
        all_polygons = []
        total_area = 0.0
        centroid_points = []
        
        for item in items:
            all_polygons.extend(item["polygons"])
            total_area += item["land_area_sqw"]
            # Get centroid of outer ring of each polygon
            for poly in item["polygons"]:
                c_lat, c_lng = calculate_centroid(poly[0])
                centroid_points.append((c_lat, c_lng))
                
        # Calculate combined centroid
        if centroid_points:
            c_lat = sum(p[0] for p in centroid_points) / len(centroid_points)
            c_lng = sum(p[1] for p in centroid_points) / len(centroid_points)
        else:
            c_lat, c_lng = 0.0, 0.0
            
        if len(all_polygons) == 1:
            geometry = {
                "type": "Polygon",
                "coordinates": all_polygons[0]
            }
        else:
            geometry = {
                "type": "MultiPolygon",
                "coordinates": all_polygons
            }
            
        feature = {
            "type": "Feature",
            "id": f"parcel_kb_{pnum.replace('.', '_')}",
            "properties": {
                "parcel_id": f"parcel_kb_{pnum.replace('.', '_')}",
                "parcel_number": pnum,
                "province": primary["province"],
                "district": primary["district"],
                "sub_district": primary["sub_district"],
                "land_area_sqw": round(total_area, 2),
                "centroid_lat": c_lat,
                "centroid_lng": c_lng
            },
            "geometry": geometry
        }
        features.append(feature)
        
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    os.makedirs(os.path.dirname(output_geojson_path), exist_ok=True)
    with open(output_geojson_path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully processed {len(features)} unique parcels. GeoJSON saved to {output_geojson_path}")

if __name__ == "__main__":
    main()
