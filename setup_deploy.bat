@echo off
SETLOCAL EnableDelayedExpansion
echo =========================================================
echo    TRD-LEX — Version Control ^& Cloud CLI Setup
echo =========================================================
echo.

:: =====================
:: PART 1: Git Setup
:: =====================
echo [PART 1] Git Version Control Setup
echo -----------------------------------

:: Check if git is available
git --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Git is not installed. Please install from: https://git-scm.com/
    echo.
    goto :CLOUD_CHECK
)

:: Check if already a git repo
if exist ".git" (
    echo [INFO] Git repository already initialized.
) else (
    echo [1/4] Initializing Git repository...
    git init
    echo [SUCCESS] Git repository initialized.
)
echo.

:: Verify .gitignore exists
if exist ".gitignore" (
    echo [2/4] .gitignore verified — .env, node_modules, __pycache__ are excluded.
) else (
    echo [WARNING] .gitignore not found!
)
echo.

:: Stage all files
echo [3/4] Staging all files...
git add .
echo [SUCCESS] Files staged.
echo.

:: Initial commit
echo [4/4] Creating initial commit...
git commit -m "feat: initial project setup — FastAPI backend + Next.js frontend

- Backend: FastAPI + Prisma ORM + PostgreSQL
  - Routes: auth, contracts, listings (CRUD)
  - Services: auth_service, contract_service, listing_service
  - JWT authentication with ThaID mock
  - Prisma schema with User, LeaseContract, Listing models
  - Database seed script with test data

- Frontend: Next.js 15 + Tailwind CSS + Leaflet
  - TRD Design System (colors, fonts, shadows, animations)
  - UI components: Button, Card, Input, Badge, Modal
  - Feature components: Navbar, LeaseMap, FeeBreakdown, ListingCard
  - TypeScript types mirroring backend models
  - API client with JWT token management

- Infrastructure: Docker Compose (PostgreSQL, pgAdmin, Backend, Frontend)
- Deployment: Dockerfiles for both backend and frontend"

if !errorlevel! neq 0 (
    echo [WARNING] Commit may have failed. Check git status manually.
) else (
    echo [SUCCESS] Initial commit created!
)
echo.

:: Prompt for remote
echo -----------------------------------
echo To push to GitHub or GitLab, run:
echo.
echo   git remote add origin https://github.com/YOUR_USERNAME/trd-lex.git
echo   git branch -M main
echo   git push -u origin main
echo.
echo Or for GitLab:
echo   git remote add origin https://gitlab.com/YOUR_USERNAME/trd-lex.git
echo   git branch -M main
echo   git push -u origin main
echo -----------------------------------
echo.

:: =====================
:: PART 2: Cloud CLI Check
:: =====================
:CLOUD_CHECK
echo.
echo [PART 2] Google Cloud CLI Check
echo -----------------------------------

:: Check if gcloud is installed
gcloud --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [INFO] Google Cloud CLI is NOT installed.
    echo.
    echo To install, visit:
    echo   https://cloud.google.com/sdk/docs/install
    echo.
    echo Or run this in PowerShell (admin):
    echo   winget install Google.CloudSDK
    echo.
) else (
    echo [INFO] Google Cloud CLI is installed:
    gcloud --version 2>&1 | findstr /i "Google Cloud SDK"
    echo.
    
    echo Checking for updates...
    gcloud components update --quiet 2>nul
    if !errorlevel! neq 0 (
        echo [INFO] Could not auto-update. Run manually: gcloud components update
    ) else (
        echo [SUCCESS] Google Cloud CLI is up to date.
    )
    echo.
    
    echo Current gcloud configuration:
    gcloud config list --format="text(core.project, core.account, compute.region)" 2>nul
    echo.
    
    echo -----------------------------------
    echo Useful gcloud commands for TRD-LEX deployment:
    echo.
    echo   # Set project
    echo   gcloud config set project YOUR_PROJECT_ID
    echo.
    echo   # Deploy backend to Cloud Run
    echo   gcloud run deploy trd-lex-backend ^
    echo     --source ./backend ^
    echo     --region asia-southeast1 ^
    echo     --allow-unauthenticated
    echo.
    echo   # Build and push Docker image
    echo   gcloud builds submit --tag asia.gcr.io/YOUR_PROJECT_ID/trd-lex-backend ./backend
    echo -----------------------------------
)

echo.

:: =====================
:: PART 3: Docker Check
:: =====================
echo [PART 3] Docker Check
echo -----------------------------------

docker --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [WARNING] Docker is NOT installed or not running.
    echo Install from: https://www.docker.com/products/docker-desktop/
) else (
    echo [INFO] Docker is available:
    docker --version
    echo.
    docker compose version 2>nul
)

echo.
echo =========================================================
echo  Setup check complete!
echo =========================================================
echo.
echo Press any key to exit...
pause > nul
