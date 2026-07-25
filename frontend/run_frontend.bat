@echo off
echo Cleaning Next.js build cache (.next)...
if exist "%~dp0.next" (
    rmdir /s /q "%~dp0.next"
)
echo Starting TRD-LEX Frontend Server on http://localhost:3000...
cd /d "%~dp0"
npm run dev
