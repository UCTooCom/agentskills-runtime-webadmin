@echo off
cls
title AgentSkills Installer

echo ========================================
echo   AgentSkills Runtime Installer
echo ========================================
echo.

REM Check Node.js
echo [1/4] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Node.js not found!
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Check pnpm
echo.
echo [2/4] Checking package manager...
where pnpm >nul 2>&1
if errorlevel 1 (
    echo [OK] Using npm
    set "PM=npm"
) else (
    echo [OK] Using pnpm
    set "PM=pnpm"
)

REM Start NestJS backend service
echo.
echo [3/4] Starting NestJS backend service...
cd /d "%~dp0nestJs"

if not exist "node_modules" (
    echo.
    echo Installing backend dependencies...
    call %PM% install
)

echo.
echo Starting NestJS backend...
start "NestJS Backend" cmd /c "%PM% run start:dev"

REM Start frontend web service
echo.
echo [4/4] Starting frontend web service...
cd /d "%~dp0web"

if not exist "node_modules" (
    echo.
    echo Installing frontend dependencies...
    call %PM% install
)

echo.
echo Starting frontend web server...
start "Frontend Web Server" cmd /c "%PM% run start"

REM Wait for backend service
echo.
echo ========================================
echo   Waiting for services to be ready...
echo ========================================
echo.
echo Waiting for backend service on port 3000...
set /a BN=0

:wait_backend
set /a BN+=1
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000/healthCheck' -UseBasicParsing -TimeoutSec 2; exit 0 } catch { exit 1 }" >nul 2>&1
if not errorlevel 1 goto :backend_ready

if %BN% geq 30 (
    echo.
    echo [WARNING] Backend service check timeout, but it may still be starting.
    goto :check_frontend
)

echo   Backend: %BN%/30
ping 127.0.0.1 -n 2 >nul
goto :wait_backend

:backend_ready
echo [OK] Backend service ready!

:check_frontend
echo.
echo Waiting for frontend service on port 3031...
set /a FN=0

:wait_frontend
set /a FN+=1
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3031' -UseBasicParsing -TimeoutSec 2; exit 0 } catch { exit 1 }" >nul 2>&1
if not errorlevel 1 goto :frontend_ready

if %FN% geq 40 (
    echo.
    echo [WARNING] Frontend service check timeout, but it may still be starting.
    goto :open_browser
)

echo   Frontend: %FN%/40
ping 127.0.0.1 -n 2 >nul
goto :wait_frontend

:frontend_ready
echo [OK] Frontend service ready!

:open_browser
echo.
echo ========================================
echo   Opening installer in browser...
echo ========================================
ping 127.0.0.1 -n 2 >nul
start http://localhost:3031/install.html

echo.
echo ========================================
echo   Installer opened in browser!
echo ========================================
echo.
echo Frontend: http://localhost:3031
echo Backend:  http://localhost:3000
echo.
echo IMPORTANT: Keep this window open!
echo Close only after installation is complete.
echo.
pause
