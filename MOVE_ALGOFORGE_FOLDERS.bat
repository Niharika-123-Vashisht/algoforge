@echo off
REM Run this script AFTER closing Cursor/VS Code to reorganize AlgoForge.
REM Moves code_assessment_platform and coding_assessment_frontend into AlgoForge\

set "ROOT=%~dp0"
set "ALGOFORGE=%ROOT%AlgoForge"
set "BACKEND=%ROOT%code_assessment_platform"
set "FRONTEND=%ROOT%coding_assessment_frontend"

echo.
echo Reorganizing AlgoForge project structure...
echo.

if not exist "%ALGOFORGE%" mkdir "%ALGOFORGE%"

if exist "%BACKEND%" (
    echo Moving code_assessment_platform to AlgoForge\...
    move "%BACKEND%" "%ALGOFORGE%\"
    if errorlevel 1 (
        echo ERROR: Could not move code_assessment_platform. Close Cursor/VS Code and try again.
        pause
        exit /b 1
    )
    echo   Done.
) else (
    echo code_assessment_platform not found or already moved.
)

if exist "%FRONTEND%" (
    echo Moving coding_assessment_frontend to AlgoForge\...
    move "%FRONTEND%" "%ALGOFORGE%\"
    if errorlevel 1 (
        echo ERROR: Could not move coding_assessment_frontend. Close Cursor/VS Code and try again.
        pause
        exit /b 1
    )
    echo   Done.
) else (
    echo coding_assessment_frontend not found or already moved.
)

echo.
echo Structure is now: AlgoForge\code_assessment_platform\ and AlgoForge\coding_assessment_frontend\
echo.
echo You can delete this script (MOVE_ALGOFORGE_FOLDERS.bat) after running.
echo.
pause
