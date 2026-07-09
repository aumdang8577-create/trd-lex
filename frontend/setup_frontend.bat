@echo off
SETLOCAL EnableDelayedExpansion
echo =========================================================
echo       TRD-LEX Frontend Setup (Next.js + Tailwind)
echo =========================================================
echo.

:: Check if running in frontend folder
if not exist "package.json" (
    echo [ERROR] Please run this batch script inside c:\TRD_lex\frontend folder.
    exit /b 1
)

:: 1. Install dependencies
echo [1/2] Installing npm dependencies...
npm install
if !errorlevel! neq 0 (
    echo [ERROR] Failed to install dependencies.
    exit /b 1
)
echo [SUCCESS] Dependencies installed.
echo.

:: 2. Install leaflet packages
echo [2/2] Installing Leaflet map library...
npm install leaflet react-leaflet
npm install -D @types/leaflet
if !errorlevel! neq 0 (
    echo [WARNING] Leaflet installation may have failed. You can retry manually.
) else (
    echo [SUCCESS] Leaflet installed.
)
echo.

echo =========================================================
echo  Frontend setup complete!
echo =========================================================
echo.
echo To start the development server:
echo   cd c:\TRD_lex\frontend
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
