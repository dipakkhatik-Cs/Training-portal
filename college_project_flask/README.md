# CyberGuard: Employee Cybersecurity Training Portal
## College Final-Year Project Documentation & Viva Voce Guide

### 1. Project Overview
**CyberGuard** is an enterprise-grade employee cybersecurity awareness and training web application. In modern enterprises, human error accounts for over 82% of cybersecurity breaches (phishing, credential theft, accidental data leaks). CyberGuard equips employees with actionable knowledge, interactive simulations, and incident reporting to build a robust "Human Firewall".

---

### 2. Technology Stack
- **Frontend**: HTML5, Modern CSS3 (Dark Navy Cybersecurity Design, Glassmorphism, CSS Grid & Flexbox), Vanilla JavaScript (ES6+)
- **Backend**: Python Flask 3.x (Lightweight WSGI Microframework, Jinja2 Templating Engine)
- **Database**: SQLite3 (ACID-compliant, embedded relational database)
- **Authentication & Security**: Werkzeug PBKDF2:SHA256 password hashing, secure session management, input validation, role-based access control (RBAC).

---

### 3. Project Directory Structure
```
college_project_flask/
│
├── app.py                   # Main Flask application and routing logic
├── models.py                # Database connection and SQLite table schemas
├── init_db.py               # Database initialization and sample data seeder
├── requirements.txt         # Python dependencies (Flask, Werkzeug)
├── cyberguard.db            # SQLite database file (generated after init_db.py)
├── README.md                # Project documentation and viva guide
│
├── templates/               # HTML5 Jinja2 Templates
│   ├── base.html            # Core layout with navigation and footer
│   ├── index.html           # Landing page with hero, statistics & features
│   ├── login.html           # Employee & Admin authentication
│   ├── dashboard.html       # Employee training dashboard & progress
│   ├── courses.html         # Training courses catalog (10 modules)
│   ├── course_detail.html   # Interactive lesson reader & tips
│   ├── quiz.html            # Cybersecurity quiz engine
│   ├── quiz_results.html    # Quiz score & detailed feedback
│   ├── phishing.html        # Interactive "Spot the Phishing Email" lab
│   ├── security_tips.html   # Actionable tips cards & checklists
│   ├── report_incident.html # Incident intake form with reference numbers
│   ├── achievements.html    # Badges, leaderboard & gamification
│   └── admin.html           # CISO / SOC administrative control console
│
└── static/                  # Static assets
    ├── css/
    │   └── style.css        # Custom CSS styling (dark cyber theme)
    └── js/
        └── main.js          # Interactive JavaScript (quiz, phishing, timers)
```

---

### 4. How to Setup and Run the Project

#### Step 1: Clone or Navigate to Project Directory
```bash
cd college_project_flask
```

#### Step 2: Create and Activate a Python Virtual Environment
```bash
# On Linux / macOS:
python3 -m venv venv
source venv/bin/activate

# On Windows:
python -m venv venv
venv\Scripts\activate
```

#### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Initialize and Seed the SQLite Database
```bash
python init_db.py
```
*(This creates `cyberguard.db` and populates sample courses, employee accounts, quiz questions, and security incidents).*

#### Step 5: Start the Flask Development Server
```bash
python app.py
```
Open your web browser and navigate to:
```
http://127.0.0.1:5000
```

---

### 5. Demo Credentials for College Evaluation

| Role | Login Identifier / Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Employee** | `emp101@cyberguard.internal` or `EMP-1042` | `CyberGuard#2025` | Training courses, interactive quiz, phishing lab, reporting incidents, achievements |
| **Admin (CISO)** | `admin@cyberguard.internal` or `SEC-ADMIN-01` | `AdminSec#2025` | Organization metrics, employee progress tracking, incident triage, course oversight |

---

### 6. Database Normalization & ER Design
The database consists of 8 normalized relational tables:
1. `users`: Stores user credentials (`password_hash`), role (`employee` or `admin`), department, security score, streak.
2. `courses`: Stores the 10 training modules with category, difficulty, duration, and icon metadata.
3. `lessons`: Stores individual course lessons with detailed content, key takeaways, and security tips.
4. `progress`: Tracks completion percentage and timestamp per user and course.
5. `quiz_questions`: Stores multiple-choice questions, options, and pedagogical explanations.
6. `quiz_results`: Records user quiz attempts, scores, and pass/fail status.
7. `incidents`: Logs reported security incidents with unique reference numbers (`INC-2025-XXXX`) and triage status.
8. `achievements`: Stores earned badges and gamified experience points.

---

### 7. Viva Voce Q&A Cheat Sheet (Top Questions for College Defense)

#### Q1: Why did you choose Python Flask over Django for this application?
**Answer**: Flask is a lightweight microframework that gives full architectural control without the heavy boilerplate of Django. For educational and focused enterprise portals, Flask allows explicit control over routing, session handling, SQLite integration, and minimal memory footprint.

#### Q2: How does the application protect stored passwords?
**Answer**: Passwords are never stored in plaintext. We utilize Werkzeug's cryptographic hashing implementation (`generate_password_hash`), which uses `PBKDF2` (Password-Based Key Derivation Function 2) combined with `SHA256` and automated unique salt generation. This resists rainbow table attacks and brute-force cracking.

#### Q3: How do you prevent SQL Injection vulnerabilities?
**Answer**: We strictly utilize parameterized queries with placeholders (`?`) in all SQLite database executions via Python's `sqlite3` module. The SQL engine treats user input strictly as data values rather than executable SQL code, completely neutralizing SQL injection.

#### Q4: How does the interactive Phishing Simulator help train employees?
**Answer**: Cognitive psychology shows that employees learn threat recognition faster through active trial-and-error than passive reading. The simulator presents realistic email headers (typosquatted domains, spoofed display names, mismatched hyperlinks) and forces a binary choice (Safe vs Phishing), providing instant forensic feedback on indicators.

#### Q5: What is Role-Based Access Control (RBAC) in your project?
**Answer**: In `app.py`, sessions store `user_role`. Protected routes like `/admin` inspect whether the logged-in user possesses `role == 'admin'`. Unauthorized employees are blocked with flash warnings and redirected to standard employee views.
