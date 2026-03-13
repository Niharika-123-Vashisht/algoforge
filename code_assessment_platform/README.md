# Code Assessment Platform (Mini HackerRank)

A Django REST backend for an online code execution platform. Users can register, create coding problems, and submit code in Python, C++, and JavaScript. Code is executed via the Judge0 API.

## Features

- **Users**: Register, login (JWT), and manage profile
- **Problems**: Create problems with title, description, sample I/O, and test cases
- **Submissions**: Submit code in Python, C++, JavaScript; run against test cases via Judge0
- **REST APIs**: Full CRUD for users, problems, languages, and submissions
- **JWT authentication** for protected endpoints
- **MySQL** database with proper models and validation

## Requirements

- Python 3.10+
- MySQL 8.0+ (or MariaDB)
- (Optional) Judge0 API key for higher rate limits

## Installation

### 1. Clone and enter project

```bash
cd code_assessment_platform
```

### 2. Create virtual environment

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

On Windows, if `mysqlclient` fails to install, use the [official wheel](https://www.lfd.uci.edu/~gohlke/pythonlibs/#mysqlclient) or install MySQL dev headers first.

### 4. MySQL database

Create a database and user:

```sql
CREATE DATABASE code_assessment_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'codeuser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON code_assessment_db.* TO 'codeuser'@'localhost';
FLUSH PRIVILEGES;
```

### 5. Environment variables

Copy the example env and set your values:

```bash
copy .env.example .env
# Edit .env: set DB_PASSWORD and optionally JUDGE0_API_KEY
```

Or set variables before running:

- `DB_NAME` (default: `code_assessment_db`)
- `DB_USER` (default: `root`)
- `DB_PASSWORD` (required)
- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `3306`)
- `JUDGE0_API_KEY` (optional; leave empty for public Judge0 CE)

### 6. Migrate and create superuser

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 7. Load sample data (optional)

```bash
python manage.py seed_data
```

This creates:

- **2 users**: `alice` / `alice123`, `bob` / `bob123`
- **3 problems**: Hello World, Sum of Two Numbers, FizzBuzz (with test cases)
- **5 submissions** (sample records; no live Judge0 run)

### 8. Run server

```bash
python manage.py runserver
```

API base: **http://127.0.0.1:8000/api/**

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register (public) |
| POST | `/api/auth/login/` | Login → JWT (public) |
| POST | `/api/auth/token/refresh/` | Refresh JWT |
| GET/PATCH | `/api/auth/profile/` | Get/update profile (JWT) |
| GET | `/api/auth/users/` | List users (JWT) |
| GET/POST | `/api/languages/` | List/create languages (JWT) |
| GET/PUT/PATCH/DELETE | `/api/languages/<id>/` | Language CRUD (JWT) |
| GET/POST | `/api/problems/` | List/create problems (JWT) |
| GET/PUT/PATCH/DELETE | `/api/problems/<id>/` | Problem CRUD (JWT) |
| GET/POST | `/api/submissions/` | List/create submissions (JWT) |
| GET | `/api/submissions/<id>/` | Get submission (JWT) |

### Example: Register and get JWT

```bash
curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"dev\",\"email\":\"dev@test.com\",\"password\":\"SecurePass123\",\"password_confirm\":\"SecurePass123\"}"
```

### Example: Submit code (after login)

```bash
# Get token from login, then:
curl -X POST http://127.0.0.1:8000/api/submissions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "{\"problem\":1,\"language\":1,\"source_code\":\"print(\\\"Hello, World!\\\")\"}"
```

## Project structure

```
code_assessment_platform/
├── config/           # Django settings, urls, wsgi, exception handler
├── users/            # User model, auth, register, profile
├── problems/         # Language, Problem, TestCase models and CRUD
├── submissions/      # Submission model, Judge0 integration, submit API
├── manage.py
├── requirements.txt
├── .env.example
└── README.md
```

## Error handling

- API errors return a consistent shape: `{"error": "...", "detail": {...}}`.
- Validation errors (e.g. empty code, invalid problem/language) return 400 with field details.
- 401 for missing or invalid JWT; 403 for permission denied; 404 for not found.

## License

MIT (or as needed for your capstone).
