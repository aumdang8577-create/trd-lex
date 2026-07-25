@echo off
chcp 65001 >nul
echo ========================================================
echo   TRD-LEX Database Update & GeoJSON Seed Automation
echo ========================================================
echo.

cd /d "%~dp0backend"

echo [1/3] Pushing Prisma Schema to PostgreSQL Database...
..\.venv\Scripts\python.exe -m prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo [!] Prisma DB Push failed via python module. Trying npx prisma db push...
    npx prisma db push
)

echo.
echo [2/3] Seeding Parcels & POI Polygons into Database...
..\.venv\Scripts\python.exe seed_geojson_data.py

echo.
echo [3/3] Database Sync Completed Successfully!
echo Please restart your FastAPI server if it is currently running.
echo.
pause
