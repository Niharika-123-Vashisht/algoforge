@echo off
REM One-click: Open AlgoForge project in Visual Studio Code
REM Uses 'code' command (add to PATH via VS Code: Shell Command "Install code command in PATH")

set "WORKSPACE=%~dp0algoforge.code-workspace"
if not exist "%WORKSPACE%" (
    echo ERROR: algoforge.code-workspace not found.
    pause
    exit /b 1
)

echo Opening AlgoForge in Visual Studio Code...
code "%WORKSPACE%"
if errorlevel 1 (
    echo.
    echo If "code" is not recognized, install it from VS Code:
    echo   Press Ctrl+Shift+P, type "Shell Command: Install 'code' command in PATH"
    echo.
    echo Or double-click algoforge.code-workspace directly in File Explorer.
    pause
)
