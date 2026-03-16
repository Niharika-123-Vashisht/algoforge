@echo off
setlocal EnableDelayedExpansion

REM AlgoForge one-click startup (backend + frontend + browser)
REM Backend: AlgoForge\code_assessment_platform | Frontend: AlgoForge\coding_assessment_frontend

set "ROOT=%~dp0"
set "BACKEND=%ROOT%AlgoForge\code_assessment_platform"
set "FRONTEND=%ROOT%AlgoForge\coding_assessment_frontend"
set "VENV=%BACKEND%\venv\Scripts\activate.bat"

if not exist "%BACKEND%\manage.py" (
    echo ERROR: Backend not found at "%BACKEND%"
    pause
    exit /b 1
)
if not exist "%FRONTEND%\package.json" (
    echo ERROR: Frontend not found at "%FRONTEND%"
    pause
    exit /b 1
)
if not exist "%VENV%" (
    echo ERROR: Python venv not found at "%BACKEND%\venv"
    echo Create it with: cd AlgoForge\code_assessment_platform ^& python -m venv venv
    pause
    exit /b 1
)

echo.
echo ========================================
echo   AlgoForge - Starting...
echo ========================================
echo.

echo Starting AlgoForge backend...
start "AlgoForge Backend" cmd /k "cd /d "%BACKEND%" && call venv\Scripts\activate.bat && set USE_SQLITE=1 && echo USE_SQLITE=1 && echo Django: http://127.0.0.1:8000 && python manage.py runserver"

echo Starting AlgoForge frontend...
start "AlgoForge Frontend" cmd /k "cd /d "%FRONTEND%" && echo Vite dev server && npm run dev"

echo Opening AlgoForge in browser...
timeout /t 4 /nobreak >nul
start "" "http://localhost:5173"

echo.
echo Backend and frontend are running in separate windows.
echo Browser will open at http://localhost:5173
echo Close those windows to stop the servers.
echo.
pause
