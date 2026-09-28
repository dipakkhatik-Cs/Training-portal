"""
CyberGuard Database Initialization & Seeder Script
Initializes SQLite database and populates dummy data for college demo.
"""

try:
    from werkzeug.security import generate_password_hash
except ImportError:
    import hashlib
    def generate_password_hash(password):
        # Fallback SHA256 if werkzeug is not yet installed in system Python
        return "pbkdf2:sha256:600000$" + hashlib.sha256(password.encode()).hexdigest()

from models import get_db_connection, init_db

def seed_db():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] > 0:
        print("Database already contains data.")
        conn.close()
        return

    print("Seeding initial data...")

    # 1. Seed Users (passwords hashed using werkzeug pbkdf2:sha256)
    emp_pwd = generate_password_hash("CyberGuard#2025")
    admin_pwd = generate_password_hash("AdminSec#2025")

    cursor.execute('''
    INSERT INTO users (employee_id, email, password_hash, name, role, department, security_score, streak_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', ("EMP-1042", "emp101@cyberguard.internal", emp_pwd, "Sarah Connor", "employee", "Cloud Operations", 88, 6))

    cursor.execute('''
    INSERT INTO users (employee_id, email, password_hash, name, role, department, security_score, streak_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', ("EMP-1088", "alex.chen@cyberguard.internal", emp_pwd, "Alex Chen", "employee", "Finance & Accounts", 92, 9))

    cursor.execute('''
    INSERT INTO users (employee_id, email, password_hash, name, role, department, security_score, streak_days)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', ("SEC-ADMIN-01", "admin@cyberguard.internal", admin_pwd, "Marcus Vance (CISO)", "admin", "Information Security & SOC", 99, 24))

    # 2. Seed 10 Courses
    courses_data = [
        ("cyber-fundamentals", "Cybersecurity Fundamentals", "cybersecurity-fundamentals", "Master the core CIA Triad (Confidentiality, Integrity, Availability), digital hygiene, and defense.", "Core Defense", "Beginner", "25 mins", 3, "shield"),
        ("password-security", "Password Security & MFA", "password-security-mfa", "Understand passphrases, brute-force mechanics, and how Multi-Factor Authentication prevents 99% of takeovers.", "Identity & Access", "Beginner", "20 mins", 3, "key"),
        ("phishing-social-eng", "Phishing & Social Engineering", "phishing-social-engineering", "Analyze deceptive emails, urgency triggers, spoofed sender domains, and spear-phishing tactics.", "Threat Awareness", "Intermediate", "35 mins", 3, "fish"),
        ("malware-awareness", "Malware & Ransomware Defense", "malware-ransomware-defense", "Identify trojans, keyloggers, and ransomware encryptors. Learn prevention and isolation strategies.", "Endpoint Protection", "Intermediate", "30 mins", 3, "bug"),
        ("safe-internet-email", "Safe Internet & Email Usage", "safe-internet-email-usage", "Protocols for secure web browsing, HTTPS certificates, attachment scanning, and link inspection.", "Communication", "Beginner", "20 mins", 3, "mail"),
        ("data-privacy-protection", "Data Privacy & Compliance", "data-privacy-compliance", "Safeguarding Personally Identifiable Information (PII), GDPR compliance, and encryption standards.", "Compliance & Governance", "Intermediate", "40 mins", 3, "database"),
        ("device-security", "Device & Endpoint Security", "device-endpoint-security", "Hardening mobile hardware, Full-Disk BitLocker/FileVault encryption, and clean screen protocols.", "Hardware & Mobile", "Beginner", "25 mins", 3, "laptop"),
        ("social-media-security", "Social Media & OSINT Awareness", "social-media-osint-awareness", "Protect personal information from attackers scraping social networks for targeted pretexting.", "Digital Footprint", "Intermediate", "20 mins", 3, "share"),
        ("incident-reporting", "Incident Reporting & Response", "incident-reporting-response", "The critical 15-minute response rule, evidence preservation, and corporate reporting procedures.", "Crisis Management", "Intermediate", "30 mins", 3, "alert"),
        ("remote-work-security", "Remote Work & Wi-Fi Security", "remote-work-wifi-security", "Safely connecting to airport and hotel Wi-Fi, using enterprise VPNs, and shoulder surfing defense.", "Distributed Teams", "Advanced", "30 mins", 3, "wifi"),
    ]

    for c in courses_data:
        cursor.execute('''
        INSERT INTO courses (id, title, slug, description, category, difficulty, duration, lessons_count, icon_name)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', c)

    # 3. Seed Quiz Questions
    quiz_data = [
        ("cyber-fundamentals", "What does the 'CIA Triad' represent in cybersecurity?", "Control, Inspection, and Authorization", "Confidentiality, Integrity, and Availability", "Cryptocurrency, Internet, and Authentication", "Centralization, Isolation, and Auditing", 1, "Confidentiality, Integrity, and Availability form the 3 foundational pillars of data security."),
        ("password-security", "Which of the following is considered the STRONGEST password practice?", "A 7-character password like P@ssw0rd", "A 4-5 random word passphrase like 'sunset-battery-falcon-origami'", "Reusing the same password across personal and work accounts", "Changing your password every 7 days", 1, "Length and random entropy in passphrases provide immense resistance to automated GPU brute force attacks."),
        ("phishing-social-eng", "You get an email from 'ceo@company-billing-alert.com' asking you to urgently buy gift cards without calling. What is this?", "A legitimate CEO emergency", "A standard HR bonus program", "Business Email Compromise (BEC) Spear Phishing", "A routine IT audit request", 2, "BEC attacks impersonate executives using artificial urgency, untraceable gift cards, and demanding avoiding phone verification."),
        ("safe-internet-email", "What must you do before connecting a work computer to airport Wi-Fi?", "Disable your firewall", "Turn on the Enterprise VPN and verify HTTPS", "Share your network folder", "Accept unknown SSL certificate warnings", 1, "Public Wi-Fi is unencrypted and vulnerable to eavesdropping; an enterprise VPN encrypts all data tunnels."),
    ]

    for q in quiz_data:
        cursor.execute('''
        INSERT INTO quiz_questions (course_id, question, option_a, option_b, option_c, option_d, correct_option, explanation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', q)

    # 4. Seed Incidents
    cursor.execute('''
    INSERT INTO incidents (reference_no, employee_name, employee_id, incident_type, urgency, affected_system, description, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', ("INC-2025-8492", "Sarah Connor", "EMP-1042", "Phishing Email", "High", "Outlook 365", "Received fake Microsoft MFA renewal email with redirect to malicious domain.", "Mitigated"))

    cursor.execute('''
    INSERT INTO incidents (reference_no, employee_name, employee_id, incident_type, urgency, affected_system, description, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', ("INC-2025-7821", "Alex Chen", "EMP-1088", "Suspicious Login", "Critical", "Finance ERP Gateway", "Anomalous login attempt from foreign Tor exit node IP.", "Resolved"))

    # 5. Seed Achievements
    cursor.execute('''
    INSERT INTO achievements (user_id, badge_id, title, description, icon, points)
    VALUES (1, 'beginner', 'Cybersecurity Beginner', 'Completed fundamental cybersecurity awareness course', 'shield', 100)
    ''')

    cursor.execute('''
    INSERT INTO achievements (user_id, badge_id, title, description, icon, points)
    VALUES (1, 'phishing_defender', 'Phishing Defender', 'Successfully passed phishing detection lab with 100% accuracy', 'fish', 250)
    ''')

    conn.commit()
    conn.close()
    print("Database seeding completed successfully for Flask + SQLite project!")

if __name__ == "__main__":
    seed_db()
