@echo off
REM Masjidly – Auto-start Docker and open browser (Windows fallback)
REM If PowerShell is blocked, run this batch file instead.
REM Requires: Docker Desktop set to "Start when you sign in"

cd /d "%~dp0\.."

echo Waiting for Docker...
set attempts=0
:wait
docker info >nul 2>&1
if %ERRORLEVEL%==0 goto ready
timeout /t 5 /nobreak >nul
set /a attempts+=1
if %attempts% LSS 12 goto wait
echo Docker did not become ready. Start Docker Desktop manually.
exit /b 1

:ready
echo Starting Masjidly...
docker compose up -d
if %ERRORLEVEL% neq 0 exit /b 1

timeout /t 10 /nobreak >nul
start http://localhost:3000
start http://localhost:1337/admin
exit /b 0
