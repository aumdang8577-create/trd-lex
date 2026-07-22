@echo off
SETLOCAL EnableDelayedExpansion
set "PYTHONUTF8=1"
echo =========================================================
echo       TRD Lease Exchange (TRD-LEX) - Backend Setup
echo =========================================================
echo.

:: Check if running in backend folder
if not exist "requirements.txt" (
    echo [ERROR] Please run this batch script inside c:\TRD_lex\backend folder.
    exit /b 1
)

:: 1. Start Docker Postgres Database
echo [1/5] Checking Docker state and launching database...
docker compose -f ..\docker-compose.yml up -d
if !errorlevel! neq 0 (
    echo [WARNING] Could not start Docker. Make sure Docker Desktop is open.
    echo Press any key to continue if your PostgreSQL is already running locally...
    pause > nul
) else (
    echo [SUCCESS] Database is running!
)
echo.

:: 2. Create Virtual Environment
echo [2/5] Creating Python virtual environment (.venv)...
if exist ".venv" (
    echo [INFO] Virtual environment .venv already exists. Skipping creation.
) else (
    python -m venv .venv
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to create virtual environment. Ensure Python 3.10+ is in your PATH.
        exit /b 1
    )
    echo [SUCCESS] Virtual environment created.
)
echo.

:: 3. Install Requirements
echo [3/5] Installing project dependencies inside virtual environment...
call .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
if !errorlevel! neq 0 (
    echo [ERROR] Failed to install dependencies.
    exit /b 1
)
echo [SUCCESS] Dependencies installed.
echo.

:: 4. Prisma Setup
echo [4/5] Setting up Prisma and syncing Database Schema...
echo Database URL: postgresql://postgres:postgres@localhost:5432/trd_lex
set "PATH=%~dp0.venv\Scripts;%PATH%"
python -m prisma generate --schema=prisma/schema.prisma
python -m prisma db push --schema=prisma/schema.prisma
if !errorlevel! neq 0 (
    echo [ERROR] Prisma failed to sync database. Is the PostgreSQL Docker container fully loaded?
    echo Please make sure docker is running and retry.
    exit /b 1
)
echo [SUCCESS] Prisma client generated and database tables created.
echo.

:: 5. Seeding Data
echo [5/5] Seeding database with mock users and lease contracts...
python seed.py
if !errorlevel! neq 0 (
    echo [WARNING] Seeding failed. You can run 'python seed.py' manually later.
) else (
    echo [SUCCESS] Database successfully seeded with mock data!
)
echo.

echo =========================================================
echo  Setup Complete! The backend is ready to run.
echo =========================================================
echo To start the backend development server:
echo   1. Open cmd/powershell
echo   2. Activate environment: backend\.venv\Scripts\activate
echo   3. Start Uvicorn server: uvicorn app.main:app --reload --port 8000
echo.
echo Press any key to exit...
pause > nul
