@echo off
echo Starting NestJS Installer Server...
cd /d "%~dp0"

REM Check package manager (prefer pnpm if available, otherwise use npm)
where pnpm >nul 2>&1
if not errorlevel 1 (
    echo Using pnpm...
    call pnpm install
    call pnpm start:dev
) else (
    echo Using npm... (pnpm not found)
    call npm install
    call npm run start:dev
)
