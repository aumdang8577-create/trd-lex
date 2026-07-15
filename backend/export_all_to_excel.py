import asyncio
import pandas as pd
from prisma import Prisma

async def main():
    print("Connecting to database...")
    db = Prisma()
    await db.connect()
    
    print("Retrieving all treasury parcels...")
    parcels = await db.treasuryparcel.find_many()
    print(f"Found {len(parcels)} parcels in total.")
    
    # Prepare data for Excel
    data_rows = []
    for p in parcels:
        data_rows.append({
            "เลขทะเบียนแปลง (ID)": p.parcel_number,
            "จังหวัด": p.province,
            "อำเภอ": p.district,
            "ตำบล": p.sub_district,
            "เนื้อที่ (ตารางวา)": p.land_area_sqw,
            "พิกัด Latitude (Centroid)": p.centroid_lat,
            "พิกัด Longitude (Centroid)": p.centroid_lng
        })
        
    df = pd.DataFrame(data_rows)
    
    # Sort by Province then parcel number (numerical sorting helper)
    def extract_num(row):
        val = row["เลขทะเบียนแปลง (ID)"]
        parts = val.split(".")
        if len(parts) > 1:
            try:
                return int(parts[1])
            except ValueError:
                return 999999
        return 999999
        
    df["_sort_key"] = df.apply(extract_num, axis=1)
    df = df.sort_values(by=["จังหวัด", "_sort_key"]).drop(columns=["_sort_key"])
    
    output_excel_path = "C:/TRD_lex/parcels_nongkhai_kanjanaburi.xlsx"
    print(f"Writing to Excel file: {output_excel_path}...")
    
    # Write to Excel with styling
    with pd.ExcelWriter(output_excel_path, engine="openpyxl") as writer:
        # We can write to a single combined sheet
        df.to_excel(writer, index=False, sheet_name="รวมแปลงที่ราชพัสดุ")
        
        # Or write to separate sheets as well for convenience
        df[df["จังหวัด"] == "หนองคาย"].to_excel(writer, index=False, sheet_name="หนองคาย")
        df[df["จังหวัด"] == "กาญจนบุรี"].to_excel(writer, index=False, sheet_name="กาญจนบุรี")
        
        # Adjust column widths for each sheet
        for sheet_name in ["รวมแปลงที่ราชพัสดุ", "หนองคาย", "กาญจนบุรี"]:
            worksheet = writer.sheets[sheet_name]
            for col in worksheet.columns:
                max_len = max(len(str(cell.value or '')) for cell in col)
                col_letter = chr(64 + col[0].column) if col[0].column <= 26 else 'A' + chr(64 + (col[0].column - 26))
                worksheet.column_dimensions[col_letter].width = max(max_len + 3, 12)
                
    print("Excel export completed successfully!")
    await db.disconnect()

if __name__ == "__main__":
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    asyncio.run(main())
