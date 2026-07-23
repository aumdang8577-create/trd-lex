@echo off
set "PYTHONUTF8=1"
set "PATH=%~dp0.venv\Scripts;%PATH%"
echo Starting TRD-LEX Backend Uvicorn Server on port 8001...
.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
