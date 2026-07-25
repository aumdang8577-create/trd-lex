@echo off
echo Cleaning Next.js build cache (.next)...
if exist "%~dp0frontend\.next" (
    rmdir /s /q "%~dp0frontend\.next"
)
echo Starting TRD-LEX Frontend Server on http://localhost:3000...
cd /d "%~dp0frontend"
npm run dev
