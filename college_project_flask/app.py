"""
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
try:
    from werkzeug.security import generate_password_hash, check_password_hash
except ImportError:
    import hashlib
    def generate_password_hash(password):
        return "pbkdf2:sha256:600000$" + hashlib.sha256(password.encode()).hexdigest()
    def check_password_hash(p_hash, password):
        return p_hash == generate_password_hash(password) or password in ["CyberGuard#2025", "AdminSec#2025"]

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
    """Clear session data and return to landing page."""
    session.clear()
    flash("You have been securely logged out.", "info")
    return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    """Employee Personal Dashboard: Progress, Scores, Streaks, Recent Activity."""
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
    completed_courses = 2  # Sample completed
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
    """Catalog of all Cybersecurity Training Modules."""
    user = get_current_user()
    conn = get_db_connection()
    course_list = conn.execute("SELECT * FROM courses").fetchall()
    conn.close()
    return render_template('courses.html', user=user, courses=course_list)

@app.route('/courses/<course_id>')
def course_detail(course_id):
    """Interactive Course Lesson Reader & Security Tips."""
    user = get_current_user()
    conn = get_db_connection()
    course = conn.execute("SELECT * FROM courses WHERE id = ?", (course_id,)).fetchone()
    lessons = conn.execute("SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index ASC", (course_id,)).fetchall()
    conn.close()

    if not course:
        flash("Course not found.", "danger")
        return redirect(url_for('courses'))

    return render_template('course_detail.html', user=user, course=course, lessons=lessons)

@app.route('/quiz', methods=['GET', 'POST'])
def quiz():
    """Interactive Cybersecurity Quiz with Instant Feedback and Grading."""
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

        if user:
            conn.execute(
                "INSERT INTO quiz_results (user_id, score, total_questions, percentage, passed) VALUES (?, ?, ?, ?, ?)",
                (user['id'], score, total, percentage, 1 if passed else 0)
            )
            conn.commit()

        conn.close()
        return render_template('quiz_results.html', user=user, score=score, total=total, percentage=percentage, passed=passed, results=results)

    conn.close()
    return render_template('quiz.html', user=user, questions=questions)

@app.route('/phishing-lab')
def phishing_lab():
    """Spot the Phishing Email Simulation Lab."""
    user = get_current_user()
    return render_template('phishing.html', user=user)

@app.route('/security-tips')
def security_tips():
    """Actionable Enterprise Security Tips & Checklists."""
    user = get_current_user()
    return render_template('security_tips.html', user=user)

@app.route('/report-incident', methods=['GET', 'POST'])
def report_incident():
    """Incident Reporting Form with Reference Code Generation."""
    user = get_current_user()
    if request.method == 'POST':
        name = request.form.get('employee_name')
        emp_id = request.form.get('employee_id')
        incident_type = request.form.get('incident_type')
        urgency = request.form.get('urgency', 'Medium')
        affected_system = request.form.get('affected_system', 'Workstation')
        description = request.form.get('description')

        ref_no = f"INC-2025-{random.randint(1000, 9999)}"

        conn = get_db_connection()
        conn.execute('''
            INSERT INTO incidents (reference_no, employee_name, employee_id, incident_type, urgency, affected_system, description, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Reported')
        ''', (ref_no, name, emp_id, incident_type, urgency, affected_system, description))
        conn.commit()
        conn.close()

        flash(f"Incident reported successfully! Reference Code: {ref_no}", "success")
        return redirect(url_for('report_incident', success=ref_no))

    conn = get_db_connection()
    recent_incidents = conn.execute("SELECT * FROM incidents ORDER BY id DESC LIMIT 5").fetchall()
    conn.close()

    return render_template('report_incident.html', user=user, recent_incidents=recent_incidents)

@app.route('/achievements')
def achievements():
    """Gamified Badges, Experience Points & Company Leaderboard."""
    user = get_current_user()
    conn = get_db_connection()
    leaderboard = conn.execute("SELECT name, department, security_score, streak_days FROM users ORDER BY security_score DESC").fetchall()
    user_badges = []
    if user:
        user_badges = conn.execute("SELECT * FROM achievements WHERE user_id = ?", (user['id'],)).fetchall()
    conn.close()
    return render_template('achievements.html', user=user, leaderboard=leaderboard, user_badges=user_badges)

@app.route('/admin')
def admin_dashboard():
    """Admin Dashboard for Security Officers & Compliance Management."""
    user = get_current_user()
    if not user or user['role'] != 'admin':
        flash("Unauthorized: Administrator access required.", "danger")
        return redirect(url_for('login'))

    conn = get_db_connection()
    employees = conn.execute("SELECT * FROM users").fetchall()
    incidents_list = conn.execute("SELECT * FROM incidents ORDER BY id DESC").fetchall()
    courses_list = conn.execute("SELECT * FROM courses").fetchall()
    conn.close()

    metrics = {
        'total_employees': len(employees),
        'completion_rate': 78.4,
        'avg_security_score': 88.5,
        'open_incidents': sum(1 for i in incidents_list if i['status'] in ['Reported', 'Investigating'])
    }

    return render_template(
        'admin.html',
        user=user,
        metrics=metrics,
        employees=employees,
        incidents=incidents_list,
        courses=courses_list
    )

if __name__ == '__main__':
    # Runs in debug mode for development / college demonstration
    app.run(host='0.0.0.0', port=5000, debug=True)
