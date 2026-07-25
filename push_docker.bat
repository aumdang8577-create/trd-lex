@echo off
echo =========================================================
echo  Pushing Docker Image: docker.io/pangtt2454/ai_coding:latest
echo =========================================================
echo.

docker push docker.io/pangtt2454/ai_coding:latest
if %errorlevel% neq 0 (
    echo [ERROR] Docker push failed! Make sure you are logged in using 'docker login'.
    exit /b %errorlevel%
)

echo.
echo [SUCCESS] Image successfully pushed to Docker Hub!
echo.
