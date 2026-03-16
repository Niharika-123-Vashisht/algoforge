# AlgoForge Deployment Guide

Deploy the **Django backend** to [Render](https://render.com) and the **React frontend** to [Vercel](https://vercel.com) so the project is available on the internet.

---

## Prerequisites

- GitHub repo: [github.com/Niharika-123-Vashisht/algoforge](https://github.com/Niharika-123-Vashisht/algoforge)
- Accounts: [Render](https://render.com), [Vercel](https://vercel.com)

**Order:** Deploy the backend first, then the frontend (so the frontend can point to the live API).

---

## 1. Deploy Backend to Render

### Option A: Using the Blueprint (render.yaml)

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect your GitHub account and select the **algoforge** repository.
3. Render will detect `render.yaml`. Click **Apply**.
4. Set **Environment** variables (if not already set by the blueprint):
   - `DJANGO_SECRET_KEY` — Generate a random string (or let Render generate it).
   - `ALLOWED_HOSTS` — `algoforge-api.onrender.com` (or your Render URL).
   - `CORS_ORIGINS` — `https://algoforge.vercel.app` (your Vercel URL; update after frontend deploy).
   - `USE_SQLITE` — `1` (for free tier; no external database).
5. Click **Create Web Service**. Wait for the first deploy to finish.
6. Copy your backend URL, e.g. **https://algoforge-api.onrender.com**.

### Option B: Manual Web Service

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Web Service**.
2. Connect GitHub and select **Niharika-123-Vashisht/algoforge**.
3. Configure:
   - **Name:** `algoforge-api`
   - **Region:** Oregon (or nearest)
   - **Branch:** `main`
   - **Root Directory:** `code_assessment_platform`
   - **Runtime:** Python 3
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
4. **Environment variables:**

   | Key               | Value                          |
   |-------------------|---------------------------------|
   | `PYTHON_VERSION`  | `3.11.0`                        |
   | `USE_SQLITE`      | `1`                             |
   | `DEBUG`           | `False`                         |
   | `DJANGO_SECRET_KEY` | (generate a long random string) |
   | `ALLOWED_HOSTS`   | `algoforge-api.onrender.com`    |
   | `CORS_ORIGINS`    | `https://algoforge.vercel.app`  |

5. **Create Web Service**. After deploy, note the URL (e.g. **https://algoforge-api.onrender.com**).

### Backend API base URL

Your API will be at: **https://algoforge-api.onrender.com/api**  
(Replace with your actual Render URL if different.)

---

## 2. Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New** → **Project**.
2. Import **Niharika-123-Vashisht/algoforge** from GitHub.
3. Configure:
   - **Root Directory:** `coding_assessment_frontend` (click **Edit** and set it).
   - **Framework Preset:** Vite (auto-detected).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment variable** (required for production):
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://algoforge-api.onrender.com/api` (your Render backend URL; no trailing slash)
5. Click **Deploy**. Wait for the build to finish.
6. Your app will be at a URL like **https://algoforge.vercel.app** (or a custom *.vercel.app URL).

### Optional: Custom domain

In the Vercel project → **Settings** → **Domains**, add a custom domain (e.g. `algoforge.vercel.app` or your own).

---

## 3. Connect Backend and Frontend

1. **Backend (Render):** Ensure `CORS_ORIGINS` includes your exact Vercel URL (e.g. `https://algoforge.vercel.app`). Update in Render → **Environment** and redeploy if needed.
2. **Frontend (Vercel):** Ensure `VITE_API_BASE_URL` is `https://algoforge-api.onrender.com/api`. Rebuild/redeploy if you change it.

---

## 4. Verify

- Open the **frontend URL** in a browser. You should see the AlgoForge login/register page.
- Register or log in. The app should talk to the **backend API** on Render.
- **Backend health:** Open `https://algoforge-api.onrender.com/` in a browser; you should see a JSON message like `{"message": "Mini Hackerrank Backend Running"}`.

---

## Notes

- **Render free tier:** The backend may spin down after inactivity; the first request can be slow (cold start). SQLite data is ephemeral on free tier; for persistent data, add a PostgreSQL database on Render.
- **Vercel:** Frontend is static; builds run on each push to `main` if you connected the repo.
- **Seeding data:** After the first deploy, you can run `python manage.py seed_data` locally against production (not recommended) or add a one-off Render run/script; for a quick demo, creating a user via the deployed frontend is enough.
