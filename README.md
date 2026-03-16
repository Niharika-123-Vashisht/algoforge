# AlgoForge

**AlgoForge** is an online coding assessment platform similar to HackerRank. It lets users create accounts, browse coding problems, write and run code in the browser, and get automated evaluation with instant feedback.

---

## Features

- **User authentication** — Register and log in to access the platform and track your progress.
- **Coding problems** — Browse a curated set of problems with descriptions, sample inputs/outputs, and difficulty levels.
- **Code execution** — Write and run code in multiple languages (e.g. Python, C++, JavaScript) using an integrated code editor.
- **Automated evaluation** — Submissions are run against test cases and scored automatically, with clear pass/fail and result details.

---

## Tech Stack

| Layer      | Technologies                          |
|-----------|----------------------------------------|
| Frontend  | React, JavaScript, HTML, CSS (Tailwind) |
| Backend   | Django (Python)                        |
| Database  | SQLite                                 |
| API       | Django REST Framework, JWT auth        |

---

## Project Structure

```
AlgoForge/
├── code_assessment_platform/   # Django backend
│   ├── config/                 # Django settings, URLs, WSGI
│   ├── users/                  # User model, auth, registration, profile
│   ├── problems/               # Problems, test cases, languages
│   ├── submissions/            # Code submissions and Judge0 integration
│   ├── manage.py
│   └── requirements.txt
│
├── coding_assessment_frontend/ # React frontend
│   ├── src/
│   │   ├── features/           # Auth, problems, submissions, leaderboard
│   │   ├── components/         # Shared UI components
│   │   ├── contexts/           # Auth, toast, error state
│   │   └── services/           # API calls
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

- **`code_assessment_platform`** — REST API for users, problems, languages, and submissions. Handles authentication (JWT), problem CRUD, and code execution via Judge0.
- **`coding_assessment_frontend`** — Single-page React app for login, problem list/detail, code editor, submissions, and leaderboard.

---

## How to Run the Project

Run the backend and frontend separately. Use two terminals.

### Backend (Django)

1. **Go to the backend folder and create a virtual environment:**

   ```bash
   cd code_assessment_platform
   python -m venv venv
   ```

2. **Activate the virtual environment:**

   - **Windows (PowerShell):** `.\venv\Scripts\Activate.ps1`  
   - **Windows (CMD):** `venv\Scripts\activate.bat`  
   - **Linux/macOS:** `source venv/bin/activate`

3. **Install dependencies and run the server:**

   ```bash
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

   The API will be at **http://127.0.0.1:8000/**.

   (Optional) Seed sample problems and users:

   ```bash
   python manage.py seed_data
   ```

### Frontend (React)

1. **Go to the frontend folder and install dependencies:**

   ```bash
   cd coding_assessment_frontend
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

   The app will open at **http://localhost:5173/** (or the port Vite shows).

Use the frontend in the browser; it talks to the Django backend for auth, problems, and submissions.

---

## Future Improvements

- Add more programming languages and editor themes.
- Leaderboard with rankings and filters.
- Problem tags, difficulty filters, and search.
- Email verification and password reset.
- Optional deployment with Docker and production database (e.g. PostgreSQL).
- Dark/light theme and accessibility improvements.

---

## Author

**Niharika Vashisht**
