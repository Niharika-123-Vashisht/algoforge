@echo off
cd /d "%~dp0"
call .venv\Scripts\activate.bat
scrapy crawl mygov
pause
