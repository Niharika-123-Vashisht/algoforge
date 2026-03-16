@echo off
REM AlgoForge - Push to GitHub
REM Run this AFTER creating https://github.com/Niharika-123-Vashisht/algoforge

cd /d "%~dp0"

echo.
echo Pushing AlgoForge to GitHub...
echo.

git remote remove origin 2>nul
git remote add origin https://github.com/Niharika-123-Vashisht/algoforge.git
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo Push failed. Make sure:
    echo 1. You created the repo: https://github.com/new ^(name: algoforge^)
    echo 2. You're signed in to GitHub
    echo 3. When prompted, sign in via the browser window
    pause
    exit /b 1
)

echo.
echo Success! AlgoForge is on GitHub.
echo https://github.com/Niharika-123-Vashisht/algoforge
pause
