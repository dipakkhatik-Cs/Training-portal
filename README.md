# CyberGuard Employee Cybersecurity Training Portal

CyberGuard is a cybersecurity awareness portal with interactive employee training, phishing simulations, quizzes, incident reporting, achievements, and an administrator dashboard. This repository includes two standalone implementations: a Next.js application and a Flask college-project version.

## Project Versions

| Application | Stack | URL | Database |
| --- | --- | --- | --- |
| Main portal | Next.js, React, TypeScript, Tailwind CSS | `http://localhost:3000` | Embedded PGlite by default; PostgreSQL can be configured with `DATABASE_URL` |
| Flask project | Python, Flask, Jinja, HTML/CSS/JavaScript | `http://127.0.0.1:5000` | SQLite |

Run each application independently. The Flask project is in [`college_project_flask`](college_project_flask/README.md).

## Main Portal: Next.js

### Requirements

- Node.js 20.9 or later
- npm

### Run locally

From the repository root:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The first database-backed request automatically creates and seeds the local PGlite database in `.cyberguard-db/`. No separate database server or seed command is needed for the default local setup. The database persists between runs and is excluded from Git.

To use PostgreSQL instead, set `DATABASE_URL` to a PostgreSQL connection string before starting the app. In this mode, provide a database with the Drizzle schema and seed data already applied.

### Available commands

```bash
npm run dev        # Start the development server
npm run build      # Create a production build
npm run start      # Serve the production build
npm run typecheck  # Run the TypeScript check
npm run lint       # Run ESLint
```

## Flask Project

The Flask app is a separate implementation with its own templates, static assets, and SQLite database.

### Requirements

- Python 3.8 or later

### Run on Windows (PowerShell)

```powershell
cd college_project_flask
py -m venv .venv
& .\.venv\Scripts\python.exe -m pip install -r requirements.txt
& .\.venv\Scripts\python.exe init_db.py
& .\.venv\Scripts\python.exe app.py
```

### Run on macOS or Linux

```bash
cd college_project_flask
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python init_db.py
python app.py
```

Open `http://127.0.0.1:5000`. The initialization script creates and seeds `cyberguard.db` in the Flask project directory.

## Demo Accounts

| Role | Employee ID | Email | Password |
| --- | --- | --- | --- |
| Employee | `EMP-1042` | `emp101@cyberguard.internal` | `CyberGuard#2025` |
| Administrator | `SEC-ADMIN-01` | `admin@cyberguard.internal` | `AdminSec#2025` |

These are demo credentials for local evaluation only. Do not use them in a deployed environment.

## Main Features

- Ten employee cybersecurity courses with lessons and progress tracking
- Phishing-awareness simulation and security tips
- Cybersecurity quizzes with results and explanations
- Incident reporting and status tracking
- Achievements, leaderboard, and employee dashboard
- Administrator metrics and incident overview
- Flask version with the same core training workflows and SQLite-backed sample data

## Repository Layout

```text
src/                  Next.js application, API routes, UI, and database code
drizzle/              Drizzle schema migrations and metadata
college_project_flask/ Standalone Flask application
```

## Security Note

This project is intended for demonstration and education. It includes seeded demo accounts, and the Flask app has a development fallback secret key. Configure secure credentials and a strong `SECRET_KEY`, review authentication and authorization, and use production database and deployment settings before exposing either app to real users.