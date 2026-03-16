@echo off
REM Push AlgoForge to GitHub
REM 1. Create a new repository on GitHub: https://github.com/new
REM    - Name: algoforge (or your choice)
REM    - Do NOT initialize with README (repo should be empty)
REM 2. Replace YOUR_USERNAME and YOUR_REPO below with your GitHub username and repo name
REM 3. Run this script

set "REPO_URL=https://github.com/YOUR_USERNAME/algoforge.git"

echo.
echo Pushing AlgoForge to GitHub...
echo.

cd /d "%~dp0"

REM Remove existing origin if present (in case URL was wrong)
git remote remove origin 2>nul

REM Add your GitHub repo as origin (EDIT THE URL ABOVE!)
git remote add origin "%REPO_URL%"

git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo FAILED. Make sure you:
    echo 1. Created an empty repo on GitHub
    echo 2. Edited this script and set REPO_URL to your repo
    echo 3. Have push access (logged in via git credential or SSH)
    pause
    exit /b 1
)

echo.
echo Success! Your project is on GitHub.
pause
