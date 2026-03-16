#!/usr/bin/env bash
# Render build script: install deps, migrate, collect static files
set -o errexit
pip install -r requirements.txt
python manage.py migrate --noinput
python manage.py collectstatic --noinput --clear
