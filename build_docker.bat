@echo off
echo =========================================================
echo  Building Docker Image: docker.io/pangtt2454/ai_coding:latest
echo =========================================================
echo.

docker build -t docker.io/pangtt2454/ai_coding:latest ./backend
if %errorlevel% neq 0 (
    echo [ERROR] Docker build failed!
    exit /b %errorlevel%
)

docker tag docker.io/pangtt2454/ai_coding:latest pangtt2454/ai_coding:latest

echo.
echo [SUCCESS] Image built successfully: docker.io/pangtt2454/ai_coding:latest
echo.
echo To push this image to Docker Hub, run:
echo   docker push docker.io/pangtt2454/ai_coding:latest
echo.
