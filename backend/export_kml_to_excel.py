import xml.etree.ElementTree as ET
import pandas as pd
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
    output_excel_path = "C:/TRD_lex/kanjanaburi_parcels.xlsx"
    
    if not os.path.exists(kml_path):
        print(f"Error: {kml_path} not found.")
        return
        
    print("Parsing Kanchanaburi KML for Excel export...")
    tree = ET.parse(kml_path)
    root = tree.getroot()
    
    ns = {"kml": "http://www.opengis.net/kml/2.2"}
    placemarks = root.findall(".//kml:Placemark", ns)
    print(f"Found {len(placemarks)} placemarks.")
    
    data_rows = []
    
    for idx, pm in enumerate(placemarks):
        name_elem = pm.find("kml:name", ns)
        name = name_elem.text if name_elem is not None else ""
        
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
        
        province = props.get("PROV_NAME", "กาญจนบุรี")
        district = props.get("AMPH_NAME", "")
        sub_district = props.get("TUMB_NAME", "")
        
        try:
            rai = float(props.get("LAND_AREA1", 0) or 0)
            ngan = float(props.get("LAND_AREA2", 0) or 0)
            sqw = float(props.get("LAND_AREA3", 0) or 0)
            total_sqw = rai * 400.0 + ngan * 100.0 + sqw
        except Exception:
            rai, ngan, sqw, total_sqw = 0, 0, 0, 0.0
            
        remark = props.get("REMARK", "")
        reg_id = props.get("REG_ID", "")
        date_create = props.get("DATECREATE", "")
        date_update = props.get("DATEUPDATE", "")
        
        # Calculate centroid from coordinates
        c_lat, c_lng = 0.0, 0.0
        polygon_elems = pm.findall(".//kml:Polygon", ns)
        for poly_elem in polygon_elems:
            outer_ring = poly_elem.find(".//kml:outerBoundaryIs//kml:coordinates", ns)
            if outer_ring is not None and outer_ring.text:
                outer_coords = parse_coordinates(outer_ring.text)
                if outer_coords:
                    c_lat, c_lng = calculate_centroid(outer_coords)
                    break
        
        row = {
            "เลขทะเบียนแปลง (ID)": parcel_number,
            "จังหวัด": province,
            "อำเภอ": district,
            "ตำบล": sub_district,
            "เนื้อที่รวม (ตารางวา)": round(total_sqw, 2),
            "เนื้อที่ (ไร่)": int(rai),
            "เนื้อที่ (งาน)": int(ngan),
            "เนื้อที่ (ตารางวาเศษ)": sqw,
            "พิกัด Latitude (กึ่งกลาง)": c_lat,
            "พิกัด Longitude (กึ่งกลาง)": c_lng,
            "หมายเหตุการใช้งาน": remark,
            "REG_ID": reg_id,
            "วันที่สร้าง": date_create,
            "วันที่อัปเดตล่าสุด": date_update
        }
        data_rows.append(row)
        
    df = pd.DataFrame(data_rows)
    
    # Sort by registration number (numerical)
    def extract_num(val):
        parts = val.split(".")
        if len(parts) > 1:
            try:
                return int(parts[1])
            except ValueError:
                return 999999
        return 999999
        
    df["_sort_key"] = df["เลขทะเบียนแปลง (ID)"].apply(extract_num)
    df = df.sort_values("_sort_key").drop(columns=["_sort_key"])
    
    # Save to excel
    print("Writing to Excel...")
    with pd.ExcelWriter(output_excel_path, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="ที่ราชพัสดุกาญจนบุรี")
        
        # Formatting column widths
        workbook = writer.book
        worksheet = writer.sheets["ที่ราชพัสดุกาญจนบุรี"]
        for col in worksheet.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = chr(64 + col[0].column) if col[0].column <= 26 else 'A' + chr(64 + (col[0].column - 26))
            worksheet.column_dimensions[col_letter].width = max(max_len + 3, 12)
            
    print(f"Successfully exported data to {output_excel_path}")

if __name__ == "__main__":
    main()
