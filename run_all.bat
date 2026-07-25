@echo off
echo Starting TRD-LEX Backend and Frontend Servers...
start "TRD-LEX Backend (Port 8001)" cmd /k "%~dp0run_backend.bat"
start "TRD-LEX Frontend (Port 3000)" cmd /k "%~dp0run_frontend.bat"
echo Success! Both Backend (http://localhost:8001) and Frontend (http://localhost:3000) have been started in separate terminal windows.
