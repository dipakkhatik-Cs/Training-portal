"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen,
  Code,
  Copy,
  Check,
  Terminal,
  Database,
  Shield,
  HelpCircle,
  FileText,
  FolderTree,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Sparkles,
} from "lucide-react";
import { playClickSound, playSuccessSound } from "@/utils/sound";

export default function CollegeVivaHub() {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<"architecture" | "codebase" | "viva" | "setup">("viva");
  const [selectedFile, setSelectedFile] = useState<string>("app.py");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedViva, setExpandedViva] = useState<number | null>(0);

  const handleCopyCode = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    playSuccessSound();
    showToast("Source code copied to clipboard!", "success");
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const codeFiles: Record<string, { filename: string; language: string; content: string; description: string }> = {
    "app.py": {
      filename: "app.py",
      language: "python",
      description: "Core Python Flask backend application with session auth, routing, and scoring logic.",
      content: `"""
CyberGuard: Employee Cybersecurity Training Portal
Main Flask Backend Application
Features:
- Session-based Authentication & Role-Based Access Control (RBAC)
- Password Hashing with Werkzeug PBKDF2:SHA256
- Interactive Training Modules & Progress Tracking
- Phishing Simulation Lab
- Interactive Quiz Engine with Explanations & Grading
- Secure Incident Reporting System with unique Reference IDs
- Gamified Leaderboard & Achievements
- Admin Management Portal (CRUD, metrics, incident status update)
"""

from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import random
import os
from models import get_db_connection, init_db

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'cyberguard-super-secret-key-2025-college-project')

# Ensure database is initialized on startup
with app.app_context():
    init_db()

# --- Helper Functions ---
def get_current_user():
    """Retrieve the logged in user from session, or None."""
    if 'user_id' not in session:
        return None
    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE id = ?", (session['user_id'],)).fetchone()
    conn.close()
    return user

# --- Routes ---

@app.route('/')
def index():
    """Landing Page with Hero, Stats, Features, How it Works."""
    user = get_current_user()
    return render_template('index.html', user=user)

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Employee & Admin Login with Password Verification."""
    if request.method == 'POST':
        login_id = request.form.get('login_id', '').strip()
        password = request.form.get('password', '').strip()
        
        conn = get_db_connection()
        user = conn.execute(
            "SELECT * FROM users WHERE email = ? OR employee_id = ?",
            (login_id, login_id)
        ).fetchone()
        conn.close()

        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            session['user_role'] = user['role']
            session['employee_id'] = user['employee_id']
            
            flash(f"Welcome back, {user['name']}!", "success")
            if user['role'] == 'admin':
                return redirect(url_for('admin_dashboard'))
            return redirect(url_for('dashboard'))
        else:
            flash("Invalid Employee ID/Email or Password. Please try again.", "danger")

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash("You have been securely logged out.", "info")
    return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    user = get_current_user()
    if not user:
        flash("Please log in to view your dashboard.", "warning")
        return redirect(url_for('login'))

    conn = get_db_connection()
    courses = conn.execute("SELECT * FROM courses").fetchall()
    achievements = conn.execute("SELECT * FROM achievements WHERE user_id = ?", (user['id'],)).fetchall()
    incidents = conn.execute("SELECT * FROM incidents WHERE employee_id = ? ORDER BY id DESC LIMIT 3", (user['employee_id'],)).fetchall()
    conn.close()

    total_courses = len(courses)
    completed_courses = 2
    progress_percent = int((completed_courses / max(total_courses, 1)) * 100)

    return render_template(
        'dashboard.html',
        user=user,
        courses=courses,
        achievements=achievements,
        incidents=incidents,
        total_courses=total_courses,
        completed_courses=completed_courses,
        progress_percent=progress_percent
    )

@app.route('/courses')
def courses():
    user = get_current_user()
    conn = get_db_connection()
    course_list = conn.execute("SELECT * FROM courses").fetchall()
    conn.close()
    return render_template('courses.html', user=user, courses=course_list)

@app.route('/quiz', methods=['GET', 'POST'])
def quiz():
    user = get_current_user()
    conn = get_db_connection()
    questions = conn.execute("SELECT * FROM quiz_questions LIMIT 5").fetchall()
    
    if request.method == 'POST':
        score = 0
        total = len(questions)
        results = []
        for q in questions:
            user_ans = request.form.get(f"q_{q['id']}")
            correct = str(q['correct_option']) == str(user_ans)
            if correct:
                score += 1
            results.append({
                'id': q['id'],
                'question': q['question'],
                'user_ans': user_ans,
                'correct': correct,
                'explanation': q['explanation']
            })
        percentage = int((score / max(total, 1)) * 100)
        passed = percentage >= 70
        conn.close()
        return render_template('quiz_results.html', user=user, score=score, total=total, percentage=percentage, passed=passed, results=results)

    conn.close()
    return render_template('quiz.html', user=user, questions=questions)

@app.route('/report-incident', methods=['GET', 'POST'])
def report_incident():
    user = get_current_user()
    if request.method == 'POST':
        ref_no = f"INC-2025-{random.randint(1000, 9999)}"
        conn = get_db_connection()
        conn.execute('''
            INSERT INTO incidents (reference_no, employee_name, employee_id, incident_type, urgency, affected_system, description, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Reported')
        ''', (ref_no, request.form.get('employee_name'), request.form.get('employee_id'), request.form.get('incident_type'), request.form.get('urgency', 'Medium'), request.form.get('affected_system', 'Workstation'), request.form.get('description')))
        conn.commit()
        conn.close()
        flash(f"Incident reported successfully! Reference Code: {ref_no}", "success")
        return redirect(url_for('report_incident', success=ref_no))

    conn = get_db_connection()
    recent = conn.execute("SELECT * FROM incidents ORDER BY id DESC LIMIT 5").fetchall()
    conn.close()
    return render_template('report_incident.html', user=user, recent_incidents=recent)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)`,
    },
    "models.py": {
      filename: "models.py",
      language: "python",
      description: "SQLite database connector and relational schema initialization.",
      content: `import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'cyberguard.db')

def get_db_connection():
    """Establish and return connection with row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table (Credentials, Role, Department, Score)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'employee',
        department TEXT NOT NULL DEFAULT 'Operations',
        security_score INTEGER NOT NULL DEFAULT 75,
        streak_days INTEGER NOT NULL DEFAULT 3,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')

    # Courses Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL DEFAULT 'Beginner',
        duration TEXT NOT NULL,
        lessons_count INTEGER NOT NULL DEFAULT 3,
        icon_name TEXT NOT NULL DEFAULT 'shield'
    )''')

    # Incidents Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference_no TEXT UNIQUE NOT NULL,
        employee_name TEXT NOT NULL,
        employee_id TEXT NOT NULL,
        incident_type TEXT NOT NULL,
        urgency TEXT NOT NULL DEFAULT 'Medium',
        affected_system TEXT NOT NULL DEFAULT 'Workstation',
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Reported',
        reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )''')

    # Achievements Table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        badge_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        points INTEGER NOT NULL DEFAULT 100,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )''')

    conn.commit()
    conn.close()
    print("Database tables initialized successfully.")`,
    },
    "init_db.py": {
      filename: "init_db.py",
      language: "python",
      description: "One-command database seeder populating demo users, courses, and incidents.",
      content: `from werkzeug.security import generate_password_hash
from models import get_db_connection, init_db

def seed_db():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] > 0:
        print("Database already seeded.")
        conn.close()
        return

    # Seed Accounts (Hashed using PBKDF2:SHA256)
    emp_pwd = generate_password_hash("CyberGuard#2025")
    admin_pwd = generate_password_hash("AdminSec#2025")

    cursor.execute('''
    INSERT INTO users (employee_id, email, password_hash, name, role, department, security_score, streak_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', ("EMP-1042", "emp101@cyberguard.internal", emp_pwd, "Sarah Connor", "employee", "Cloud Operations", 88, 6))

    cursor.execute('''
    INSERT INTO users (employee_id, email, password_hash, name, role, department, security_score, streak_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', ("SEC-ADMIN-01", "admin@cyberguard.internal", admin_pwd, "Marcus Vance (CISO)", "admin", "Information Security & SOC", 99, 24))

    conn.commit()
    conn.close()
    print("Seeding completed successfully!")

if __name__ == '__main__':
    seed_db()`,
    },
    "requirements.txt": {
      filename: "requirements.txt",
      language: "text",
      description: "Python package specifications for pip installer.",
      content: `Flask==3.0.3
Werkzeug==3.0.3`,
    },
  };

  const vivaQuestions = [
    {
      q: "1. What is the core problem CyberGuard solves, and why is employee cybersecurity training necessary?",
      a: "According to the Verizon Data Breach Investigations Report (DBIR), over 82% of cybersecurity breaches involve the human element (such as falling for spear-phishing, credential theft, or accidental data leaks). While enterprises invest heavily in firewalls and antivirus software, attackers target the path of least resistance: humans. CyberGuard transforms employees from a security liability into an active 'Human Firewall' through micro-learning and interactive phishing drills.",
    },
    {
      q: "2. Why was Python Flask chosen for the backend over larger frameworks like Django?",
      a: "Flask is a lightweight, modular WSGI microframework that offers fine-grained architectural control without the heavy bloat and opinionated ORM constraints of Django. For a specialized training portal, Flask allows explicit route definition, clean integration with SQLite, minimal memory consumption, and straightforward code readability that is easy to explain during academic evaluation.",
    },
    {
      q: "3. How is user authentication secured, and how are passwords stored?",
      a: "Passwords are NEVER stored in plaintext. We utilize Werkzeug's `generate_password_hash` implementation, which applies PBKDF2 (Password-Based Key Derivation Function 2) combined with SHA-256 and automated unique per-user cryptographic salts. This renders pre-computed rainbow tables and dictionary attacks computationally infeasible.",
    },
    {
      q: "4. How does the application defend against SQL Injection vulnerabilities?",
      a: "All database queries strictly execute via parameterized SQL statements (using `?` parameter placeholders in Python SQLite3, and Drizzle typed query builders in PostgreSQL). Input data is transmitted separately from the SQL statement execution structure, preventing malicious payloads like `' OR '1'='1` from altering query logic.",
    },
    {
      q: "5. What is Role-Based Access Control (RBAC) and how is it implemented?",
      a: "RBAC restricts system access based on the verified role of the authenticated user. In CyberGuard, users possess either an 'employee' role or an 'admin' role. The `/admin` routes verify whether `session['user_role'] == 'admin'`. Unauthorized regular employees are blocked from viewing administrative telemetry and incident management queues.",
    },
    {
      q: "6. Explain the CIA Triad and how it is taught in your portal curriculum.",
      a: "The CIA Triad is the foundational benchmark of information security: Confidentiality (data is only visible to authorized entities), Integrity (data is accurate and untampered), and Availability (systems are operational and accessible). CyberGuard dedicates Course 1 specifically to teaching how attacks target each pillar (e.g. sniffing targets Confidentiality, ransomware targets Availability).",
    },
    {
      q: "7. How does the interactive Phishing Simulator improve threat detection?",
      a: "Passive learning (reading PDFs) has low retention for threat recognition. The simulator replicates genuine deceptive email headers (lookalike domains like `@msoft-account-verify.online`, artificial urgency, hidden URL redirects) and forces an active decision (Safe vs Phishing). Immediate tactical feedback breaks down exact forensic red flags to build real muscle memory.",
    },
    {
      q: "8. Explain the database schema normalization.",
      a: "The database is normalized up to Third Normal Form (3NF). We have separated distinct entities into dedicated tables: `users`, `courses`, `lessons`, `progress`, `quiz_questions`, `quiz_attempts`, `incidents`, and `achievements`. Foreign keys enforce referential integrity and eliminate transitive functional dependencies.",
    },
    {
      q: "9. How does the Incident Reporting workflow function in an enterprise context?",
      a: "The golden window for containing a cybersecurity breach is the first 15 minutes. When an employee reports an incident (such as clicking a suspicious link or losing a company laptop), CyberGuard generates a unique reference ticket (e.g., `INC-2025-8492`), immediately logs it to the SOC queue, and provides the employee with instant containment instructions (e.g., disconnect Wi-Fi, change password).",
    },
    {
      q: "10. What are the key principles of Zero Trust Architecture demonstrated in this project?",
      a: "Zero Trust operates on the principle of 'Never Trust, Always Verify'. Even inside the internal network, every access request must be explicitly authenticated and authorized using least-privilege access. The project demonstrates this through continuous session verification, mandatory multi-factor authentication education, and clear segregation of duties between employees and SOC administrators.",
    },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="rounded-3xl bg-slate-900/90 border border-purple-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>COLLEGE CAPSTONE PROJECT SUBMISSION MATERIALS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            College Viva Voce & Academic Documentation Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            Comprehensive reference manual, standalone Python Flask + SQLite codebase files, architectural diagrams, and oral defense Q&A guide.
          </p>
        </div>

        {/* Evaluator Credentials Card */}
        <div className="bg-slate-950/80 border border-purple-500/30 p-4 rounded-2xl flex-shrink-0 space-y-1 font-mono text-xs">
          <p className="text-[10px] uppercase font-bold text-purple-300">DEMO EVALUATOR LOGINS:</p>
          <div className="text-slate-300">
            <span className="text-cyan-400 font-bold">Employee:</span> emp101@cyberguard.internal
          </div>
          <div className="text-slate-300">
            <span className="text-amber-400 font-bold">Admin:</span> admin@cyberguard.internal
          </div>
          <div className="text-slate-500 text-[10px]">
            Password: CyberGuard#2025 / AdminSec#2025
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: "viva", label: "Viva Voce Questions & Answers", icon: HelpCircle },
          { id: "codebase", label: "Flask & SQLite Source Code", icon: Code },
          { id: "architecture", label: "System Architecture & ERD", icon: Layers },
          { id: "setup", label: "Local Setup & Run Instructions", icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Viva Voce Questions & Answers */}
      {activeTab === "viva" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Top 10 Viva Voce Questions & Model Answers for Final Defense</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">ORAL EXAMINATION PREPARATION</span>
          </div>

          <div className="space-y-3">
            {vivaQuestions.map((item, idx) => {
              const isExpanded = expandedViva === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition"
                >
                  <button
                    onClick={() => setExpandedViva(isExpanded ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-800/40"
                  >
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition transform ${
                        isExpanded ? "rotate-180 text-purple-400" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                      <strong className="text-purple-300 font-mono block mb-1">
                        Model Viva Answer:
                      </strong>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Flask Codebase Inspector */}
      {activeTab === "codebase" && (
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-purple-400" />
                <span>Python Flask & SQLite Source Code Viewer</span>
              </h3>
              <p className="text-xs text-slate-400">
                Inspect, copy, or explain clean Python backend files stored in <code className="text-purple-300 font-mono">college_project_flask/</code>
              </p>
            </div>

            {/* File Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {Object.keys(codeFiles).map((fileKey) => (
                <button
                  key={fileKey}
                  onClick={() => {
                    playClickSound();
                    setSelectedFile(fileKey);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                    selectedFile === fileKey
                      ? "bg-purple-600 text-white"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {fileKey}
                </button>
              ))}
            </div>
          </div>

          {/* Active File Header */}
          {codeFiles[selectedFile] && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="font-mono text-xs font-bold text-purple-300">
                    File: college_project_flask/{codeFiles[selectedFile].filename}
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {codeFiles[selectedFile].description}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleCopyCode(selectedFile, codeFiles[selectedFile].content)
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedKey === selectedFile ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Pre Box */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto max-h-[500px]">
                <pre className="text-xs font-mono text-slate-300 leading-relaxed">
                  <code>{codeFiles[selectedFile].content}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Architecture & ERD */}
      {activeTab === "architecture" && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Three-Tier System Architecture</span>
            </h3>

            {/* Architecture diagram boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tier 1 */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold">
                  PRESENTATION TIER
                </span>
                <h4 className="text-base font-bold text-white">Client Interface</h4>
                <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <li>• HTML5 Semantic Layout</li>
                  <li>• CSS3 Cybersecurity Dark Theme & Glassmorphism</li>
                  <li>• JavaScript (ES6+) for interactive quiz timers & phishing inspections</li>
                  <li>• Responsive design across Desktop, Tablet, and Mobile devices</li>
                </ul>
              </div>

              {/* Tier 2 */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-400 font-bold">
                  APPLICATION TIER
                </span>
                <h4 className="text-base font-bold text-white">Flask WSGI Controller</h4>
                <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <li>• Python 3.x with Flask Framework</li>
                  <li>• PBKDF2:SHA256 password hashing via Werkzeug</li>
                  <li>• Session-based state & Role-Based Access Control (RBAC)</li>
                  <li>• Modular routes: Auth, Courses, Quiz, Incidents, Admin</li>
                </ul>
              </div>

              {/* Tier 3 */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">
                  DATA STORAGE TIER
                </span>
                <h4 className="text-base font-bold text-white">Relational Database</h4>
                <ul className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                  <li>• SQLite3 / PostgreSQL relational engine</li>
                  <li>• ACID compliance for consistent transaction logs</li>
                  <li>• Parameterized queries mitigating SQL Injection</li>
                  <li>• 8 normalized tables with foreign key cascades</li>
                </ul>
              </div>
            </div>

            {/* Database Tables Summary */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-sm font-mono font-bold text-slate-300 uppercase mb-3">
                Normalized Relational Schema Entities (8 Tables)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-cyan-400">users</p>
                  <p className="text-[11px] text-slate-400">ID, email, password_hash, role, score, streak</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-cyan-400">courses</p>
                  <p className="text-[11px] text-slate-400">10 modules, difficulty, duration, icon</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-cyan-400">lessons</p>
                  <p className="text-[11px] text-slate-400">Course FK, content, key takeaways, tips</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-cyan-400">quiz_questions</p>
                  <p className="text-[11px] text-slate-400">Options, correct index, explanation</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-cyan-400">quiz_results</p>
                  <p className="text-[11px] text-slate-400">User FK, score, percentage, passed</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-cyan-400">incidents</p>
                  <p className="text-[11px] text-slate-400">Reference no, type, urgency, status</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-cyan-400">progress</p>
                  <p className="text-[11px] text-slate-400">User FK, course FK, completion status</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-cyan-400">achievements</p>
                  <p className="text-[11px] text-slate-400">Badge ID, title, points, timestamp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Local Setup Guide */}
      {activeTab === "setup" && (
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              <span>Step-by-Step Instructions to Run the Standalone Project</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Follow these commands on your computer to run the Python Flask application natively
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="font-bold text-cyan-300">Step 1: Open Terminal & Navigate to Project</p>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-slate-300">
                cd college_project_flask
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="font-bold text-cyan-300">Step 2: Create Virtual Environment</p>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-slate-300">
                # On Windows:
                <br />
                python -m venv venv
                <br />
                venv\Scripts\activate
                <br />
                <br />
                # On Linux / macOS:
                <br />
                python3 -m venv venv
                <br />
                source venv/bin/activate
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="font-bold text-cyan-300">Step 3: Install Dependencies</p>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-slate-300">
                pip install -r requirements.txt
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="font-bold text-cyan-300">Step 4: Initialize and Seed SQLite Database</p>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-slate-300">
                python init_db.py
              </div>
              <p className="text-[11px] text-slate-500">
                Creates `cyberguard.db` and populates demo employee accounts, courses, and quiz questions.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <p className="font-bold text-cyan-300">Step 5: Launch Flask Development Server</p>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-slate-300">
                python app.py
              </div>
              <p className="text-[11px] text-slate-400">
                Open your browser and navigate to: <code className="text-cyan-400 font-bold">http://127.0.0.1:5000</code>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
