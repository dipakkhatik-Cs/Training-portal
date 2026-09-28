import { db } from "./index";
import { users, courses, lessons, quizQuestions, incidents, achievements, userCourseProgress } from "./schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  try {
    // Check if courses already exist
    const existingCourses = await db.select().from(courses);
    if (existingCourses.length > 0) {
      console.log("Database already seeded with", existingCourses.length, "courses.");
      return;
    }

    console.log("Seeding database with cybersecurity portal data...");

    // 1. Seed Users
    await db.insert(users).values([
      {
        id: "usr_emp_101",
        employeeId: "EMP-1042",
        email: "emp101@cyberguard.internal",
        passwordHash: "CyberGuard#2025",
        name: "Sarah Connor",
        role: "employee",
        department: "Cloud Operations",
        securityScore: 88,
        streakDays: 6,
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "usr_emp_102",
        employeeId: "EMP-1088",
        email: "alex.chen@cyberguard.internal",
        passwordHash: "CyberGuard#2025",
        name: "Alex Chen",
        role: "employee",
        department: "Finance & Accounts",
        securityScore: 92,
        streakDays: 9,
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "usr_emp_103",
        employeeId: "EMP-1095",
        email: "priya.sharma@cyberguard.internal",
        passwordHash: "CyberGuard#2025",
        name: "Priya Sharma",
        role: "employee",
        department: "Human Resources",
        securityScore: 95,
        streakDays: 14,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      {
        id: "usr_admin_01",
        employeeId: "SEC-ADMIN-01",
        email: "admin@cyberguard.internal",
        passwordHash: "AdminSec#2025",
        name: "Marcus Vance (CISO)",
        role: "admin",
        department: "Information Security & SOC",
        securityScore: 99,
        streakDays: 24,
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      },
    ]);

    // 2. Seed 10 Courses
    const courseList = [
      {
        id: "cyber-fundamentals",
        title: "Cybersecurity Fundamentals",
        slug: "cybersecurity-fundamentals",
        description: "Master the core pillars of cybersecurity: Confidentiality, Integrity, and Availability (CIA Triad), digital hygiene, and organizational defense.",
        category: "Core Defense",
        difficulty: "Beginner",
        duration: "25 mins",
        lessonsCount: 3,
        iconName: "Shield",
      },
      {
        id: "password-security",
        title: "Password Security & MFA",
        slug: "password-security-mfa",
        description: "Understand entropy, passphrases, brute-force tactics, why periodic rotation is outdated, and how Multi-Factor Authentication stops 99.9% of account takeovers.",
        category: "Identity & Access",
        difficulty: "Beginner",
        duration: "20 mins",
        lessonsCount: 3,
        iconName: "Key",
      },
      {
        id: "phishing-social-eng",
        title: "Phishing & Social Engineering",
        slug: "phishing-social-engineering",
        description: "Analyze psychological triggers used by attackers: authority, urgency, fear, and curiosity. Learn to dissect spoofed sender headers and deceptive links.",
        category: "Threat Awareness",
        difficulty: "Intermediate",
        duration: "35 mins",
        lessonsCount: 3,
        iconName: "Fish",
      },
      {
        id: "malware-awareness",
        title: "Malware & Ransomware Defense",
        slug: "malware-ransomware-defense",
        description: "Explore trojans, spyware, keyloggers, and devastating ransomware strains. Learn how drive-by downloads occur and how to halt lateral movement.",
        category: "Endpoint Protection",
        difficulty: "Intermediate",
        duration: "30 mins",
        lessonsCount: 3,
        iconName: "Bug",
      },
      {
        id: "safe-internet-email",
        title: "Safe Internet & Email Usage",
        slug: "safe-internet-email-usage",
        description: "Protocols for secure browsing (HTTPS, TLS certificates), DNS hygiene, blocking malicious attachments, and recognizing business email compromise (BEC).",
        category: "Communication",
        difficulty: "Beginner",
        duration: "20 mins",
        lessonsCount: 3,
        iconName: "Mail",
      },
      {
        id: "data-privacy-protection",
        title: "Data Privacy & Compliance",
        slug: "data-privacy-compliance",
        description: "Handling Personally Identifiable Information (PII), GDPR/HIPAA compliance, classification tiers (Public, Internal, Confidential, Restricted), and encryption basics.",
        category: "Compliance & Governance",
        difficulty: "Intermediate",
        duration: "40 mins",
        lessonsCount: 3,
        iconName: "Database",
      },
      {
        id: "device-security",
        title: "Device & Endpoint Security",
        slug: "device-endpoint-security",
        description: "Hardening company laptops and mobile devices, Full-Disk Encryption (BitLocker/FileVault), zero-trust screen lock policies, and patching cadence.",
        category: "Hardware & Mobile",
        difficulty: "Beginner",
        duration: "25 mins",
        lessonsCount: 3,
        iconName: "Laptop",
      },
      {
        id: "social-media-security",
        title: "Social Media & OSINT Awareness",
        slug: "social-media-osint-awareness",
        description: "How cybercriminals harvest Open Source Intelligence (OSINT) from LinkedIn, Instagram, and Twitter to craft bespoke spear-phishing campaigns.",
        category: "Digital Footprint",
        difficulty: "Intermediate",
        duration: "20 mins",
        lessonsCount: 3,
        iconName: "Share2",
      },
      {
        id: "incident-reporting",
        title: "Incident Reporting & Response",
        slug: "incident-reporting-response",
        description: "The golden 15-minute window: what constitutes a security incident, immediate containment steps, and how prompt reporting saves enterprise networks.",
        category: "Crisis Management",
        difficulty: "Intermediate",
        duration: "30 mins",
        lessonsCount: 3,
        iconName: "AlertTriangle",
      },
      {
        id: "remote-work-security",
        title: "Remote Work & Wi-Fi Security",
        slug: "remote-work-wifi-security",
        description: "Mitigating risks in coffee shops, airports, and home offices. Man-in-the-Middle (MitM) rogue access points, Split-tunnel VPNs, and physical shoulder surfing.",
        category: "Distributed Teams",
        difficulty: "Advanced",
        duration: "30 mins",
        lessonsCount: 3,
        iconName: "Wifi",
      },
    ];

    await db.insert(courses).values(courseList);

    // 3. Seed Lessons for Key Courses
    await db.insert(lessons).values([
      // Course 1: Fundamentals
      {
        courseId: "cyber-fundamentals",
        orderIndex: 1,
        title: "The CIA Triad & Modern Threat Landscape",
        summary: "Understand the three foundational pillars of information security and how attackers attempt to breach each one.",
        content: `Every cybersecurity program rests on three cardinal pillars known as the CIA Triad:
1. Confidentiality: Ensuring that sensitive information is accessible only to authorized entities. Breaches occur through credential theft, sniffing, or unauthorized disclosure.
2. Integrity: Safeguarding the accuracy, completeness, and authenticity of data and software. Unauthorized alterations or database tampering violate integrity.
3. Availability: Ensuring authorized users have reliable and timely access to information assets. Denial of Service (DoS) and ransomware attacks primarily target availability.

In modern enterprise environments, human error accounts for over 82% of all data breaches according to the Verizon Data Breach Investigations Report (DBIR). You are not just an employee; you are the first and most critical perimeter of company defense.`,
        keyTakeaways: JSON.stringify([
          "Confidentiality keeps secrets safe from unauthorized eyes.",
          "Integrity guarantees data hasn't been altered or tampered with.",
          "Availability ensures systems stay running when business operations need them.",
          "The human firewall is the ultimate defense against cyber attacks."
        ]),
        tips: JSON.stringify([
          "Never share credentials or write down passwords on sticky notes.",
          "Always verify if an email requesting wire transfers has legitimate sign-off.",
          "Lock your workstation whenever stepping away for even 30 seconds."
        ]),
      },
      {
        courseId: "cyber-fundamentals",
        orderIndex: 2,
        title: "Common Cyber Attack Vectors",
        summary: "Recognize how adversaries attempt to gain an initial foothold into corporate networks.",
        content: `Attackers do not break through 256-bit AES encryption; they look for the path of least resistance:
- Social Engineering: Manipulating psychological triggers rather than exploiting technical vulnerabilities.
- Unpatched Vulnerabilities: Outdated software or operating systems with known CVEs (Common Vulnerabilities and Exposures).
- Weak Authentication: Single-factor passwords, reused credentials from external breaches, and lack of rate-limiting.
- Malicious Peripherals: Rogue USB drives left in parking lots or lobbies ('Baiting').

Once an adversary gains a single compromised endpoint, they initiate 'Lateral Movement'—scanning internal networks to compromise Domain Controllers and sensitive customer databases.`,
        keyTakeaways: JSON.stringify([
          "Attackers target humans first because people are more susceptible than cryptography.",
          "Regular updates eliminate known security holes.",
          "Unknown USB drives can execute malicious payloads within milliseconds of insertion."
        ]),
        tips: JSON.stringify([
          "Never plug unknown USB sticks into corporate hardware.",
          "Keep automatic updates enabled on all approved business applications.",
          "Notify IT SOC if you observe sluggish performance or anomalous popups."
        ]),
      },
      {
        courseId: "cyber-fundamentals",
        orderIndex: 3,
        title: "The Zero Trust Architecture",
        summary: "Learn why 'Never Trust, Always Verify' is replacing traditional castle-and-moat network security.",
        content: `Historically, corporate IT treated the internal office network as a trusted fortress: once inside the firewall, users could access file servers freely. 

Zero Trust eliminates implicit trust. Every access request—regardless of whether it originates inside the corporate headquarters or from a remote laptop—must be explicitly authenticated, authorized, and encrypted.

Key principles of Zero Trust:
1. Verify Explicitly: Always authenticate and authorize based on all available data points (identity, location, device health, service or workload).
2. Use Least Privilege Access: Limit user access with Just-In-Time and Just-Enough-Access (JIT/JEA) policies.
3. Assume Breach: Minimize blast radius and segment access. Verify end-to-end encryption and continuously monitor telemetry.`,
        keyTakeaways: JSON.stringify([
          "Zero Trust assumes threats exist both outside and inside the network.",
          "Least privilege ensures accounts only have access to what is strictly required.",
          "Continuous re-authentication prevents session hijacking."
        ]),
        tips: JSON.stringify([
          "Expect frequent step-up MFA prompts for sensitive database operations.",
          "Request only the software permissions you need for daily deliverables."
        ]),
      },

      // Course 2: Password Security & MFA
      {
        courseId: "password-security",
        orderIndex: 1,
        title: "The Science of Passphrases & Entropy",
        summary: "Why length beats complexity: how brute force attacks work and why 4 random words defeat supercomputers.",
        content: `Traditional password guidelines mandated complex combinations like 'Tr0ub4dor&3' which are hard for humans to remember but trivial for modern GPU clusters calculating billions of hashes per second.

Modern NIST (National Institute of Standards and Technology) Special Publication 800-63B guidelines recommend:
- Long Passphrases: A sequence of 4 to 5 random words (e.g. 'purple-elephant-battery-staple') provides over 60 bits of entropy.
- Length over Complexity: A 16-character passphrase composed of simple words is exponentially harder to crack than an 8-character password with symbols.
- No arbitrary 30-day expirations: Forced frequent rotation leads users to merely increment a number at the end (e.g., 'Spring2024!' to 'Spring2025!'), reducing security.`,
        keyTakeaways: JSON.stringify([
          "Length provides far more cryptographic entropy than symbol complexity alone.",
          "Passphrases made of 4+ random words are easy to memorize and nearly impossible to crack.",
          "Never reuse passwords across personal and work accounts."
        ]),
        tips: JSON.stringify([
          "Use a corporate-approved Password Manager like 1Password or Bitwarden.",
          "Generate unique 20+ character passwords for every single website."
        ]),
      },
      {
        courseId: "password-security",
        orderIndex: 2,
        title: "Multi-Factor Authentication (MFA) Explained",
        summary: "The three authentication factors and why SMS MFA is vulnerable to SIM-swapping.",
        content: `Authentication factors are categorized into three distinct classes:
1. Something You Know: Password, PIN, or passphrase.
2. Something You Have: Smartphone authenticator app (TOTP), hardware security key (YubiKey/FIDO2).
3. Something You Are: Biometrics such as fingerprint, facial recognition, or retina scan.

Why SMS OTP is discouraged:
SMS text messages are transmitted in cleartext through cellular signaling networks (SS7) and are vulnerable to SIM-swap fraud. 

Best Practice Hierarchy:
1. FIDO2 / WebAuthn Hardware Security Keys (Phishing-resistant)
2. Authenticator Apps generating Time-based One-Time Passwords (TOTP)
3. Push notification with Number Matching (mitigates MFA Fatigue attacks)
4. SMS / Voice Call (only as a last resort).`,
        keyTakeaways: JSON.stringify([
          "MFA requires two or more independent credential types.",
          "Authenticator apps and hardware keys resist phishing attacks.",
          "Beware of MFA Fatigue: never approve an unexpected push prompt."
        ]),
        tips: JSON.stringify([
          "If you receive an MFA push notification you did not trigger, reject it immediately and notify the SOC.",
          "Never share an authenticator OTP over the phone or in chat."
        ]),
      },
      {
        courseId: "password-security",
        orderIndex: 3,
        title: "Credential Stuffing & Dark Web Breaches",
        summary: "How cybercriminals use automated bots to test billions of stolen credentials against company portals.",
        content: `When a consumer service (like an online retail shop or gaming forum) gets breached, attackers dump the username and password hashes into large compilation lists (e.g., Collection #1-#5).

Automated bot networks then perform 'Credential Stuffing'—attempting those identical email/password pairs across corporate VPNs, Office 365, and AWS consoles.

If an employee uses their corporate email and a reused password on an external website, an external breach directly jeopardizes the company network.`,
        keyTakeaways: JSON.stringify([
          "Credential stuffing exploits human password reuse at massive automated scale.",
          "Never use your corporate email address to sign up for personal hobby websites.",
          "A password manager prevents password reuse across independent systems."
        ]),
        tips: JSON.stringify([
          "Check haveibeenpwned.com to see if your historical accounts have been in public dumps.",
          "Immediately change passwords if a service notifies you of a security incident."
        ]),
      },

      // Course 3: Phishing
      {
        courseId: "phishing-social-eng",
        orderIndex: 1,
        title: "Anatomy of a Phishing Attack",
        summary: "Inspect headers, lookalike domains (typosquatting), and deceptive sender displays.",
        content: `Phishing is the deliberate attempt to steal confidential credentials, financial assets, or deploy malware by masquerading as a trustworthy entity in electronic communications.

Core Components of Phishing Emails:
1. Display Name Spoofing: The sender name shows 'CEO John Smith', but the actual SMTP header address is 'ceo-office-update@fast-mail-server.xyz'.
2. Typosquatting / Lookalike Domains: Using characters that look identical to genuine letters, such as 'cypberguard.com' or using Cyrillic homoglyphs.
3. Hidden Hyperlinks: The visible text says 'https://portal.company.com', but hovering over the link reveals a redirect to 'http://suspicious-login-capture.ru/login'.
4. Generic or Mismatched Greetings: 'Dear Valued Customer' instead of personalized company greetings.`,
        keyTakeaways: JSON.stringify([
          "Always check the actual email address inside the angle brackets, not just the display name.",
          "Hover over every link to inspect the true destination URL before clicking.",
          "Be suspicious of communications that do not address you by your full name."
        ]),
        tips: JSON.stringify([
          "On mobile, press and hold a link to preview the full URL before tapping.",
          "Never click links in unexpected password reset emails."
        ]),
      },
      {
        courseId: "phishing-social-eng",
        orderIndex: 2,
        title: "Spear Phishing & Business Email Compromise (BEC)",
        summary: "Targeted attacks against executives, finance officers, and HR personnel.",
        content: `Unlike bulk spam sent to millions of people, Spear Phishing is highly customized and researched:
- Attackers review LinkedIn to identify who manages accounts payable or payroll.
- They craft emails impersonating the CEO or a known external vendor: 'Urgent Wire Transfer: Vendor Invoice Past Due'.
- They create artificial urgency ('Must be finalized before 5 PM today, do not call me as I am boarding an international flight').

Business Email Compromise (BEC) accounts for billions of dollars in enterprise losses annually according to the FBI Internet Crime Complaint Center (IC3).

Standard Operating Procedure:
Always perform Out-of-Band verification. If an email requests a change in bank routing details or an emergency wire transfer, telephone the verified executive or vendor over a known internal phone number.`,
        keyTakeaways: JSON.stringify([
          "Spear phishing targets specific roles with customized context.",
          "Artificial urgency and secrecy are prime indicators of social engineering.",
          "Always verify financial change requests through secondary out-of-band communication."
        ]),
        tips: JSON.stringify([
          "Never comply with urgent gift card or wire transfer requests via email alone.",
          "Report suspect emails with the CyberGuard Phish Alert button."
        ]),
      },
      {
        courseId: "phishing-social-eng",
        orderIndex: 3,
        title: "Smishing, Vishing & Pretexting",
        summary: "Social engineering beyond your email inbox: SMS traps and fraudulent IT helpdesk calls.",
        content: `Adversaries use multi-channel deception:
- Smishing (SMS Phishing): Text messages claiming 'Your package has been detained, pay $1.50 customs fee' or 'Bank Alert: Unauthorized transaction detected'.
- Vishing (Voice Phishing): Callers posing as Microsoft Tech Support or the internal IT Helpdesk asking for your MFA code to 'resolve a server glitch'.
- Pretexting: Fabricating an elaborate scenario where the attacker pretends to be an auditor, prospective client, or executive assistant needing immediate system access.

Remember: Legitimate IT staff will NEVER ask you for your password or your one-time multi-factor authentication passcode!`,
        keyTakeaways: JSON.stringify([
          "Smishing attacks target mobile devices where URLs are harder to inspect.",
          "IT Helpdesk technicians never need your password or MFA code.",
          "Hang up and call the official IT Helpdesk number if someone demands credentials."
        ]),
        tips: JSON.stringify([
          "Do not answer security questions with factual public information (e.g. mother's maiden name on Facebook).",
          "Challenge unbadged visitors in the office by asking for their visitor pass."
        ]),
      },
    ]);

    // 4. Seed Quiz Questions (Comprehensive bank of 10 questions)
    await db.insert(quizQuestions).values([
      {
        courseId: "cyber-fundamentals",
        question: "What are the three core principles of the CIA Triad in cybersecurity?",
        options: JSON.stringify([
          "Control, Inspection, and Authorization",
          "Confidentiality, Integrity, and Availability",
          "Cryptocurrency, Internet, and Authentication",
          "Centralization, Isolation, and Auditing"
        ]),
        correctIndex: 1,
        explanation: "The CIA Triad stands for Confidentiality (protecting data from unauthorized disclosure), Integrity (ensuring data is accurate and untampered), and Availability (ensuring systems are accessible to authorized users).",
      },
      {
        courseId: "password-security",
        question: "According to modern NIST cybersecurity standards, which of the following is considered the STRONGEST password strategy?",
        options: JSON.stringify([
          "A 7-character password with multiple symbols like 'P@$$w0r'",
          "A memorable passphrase made of 4 or 5 random words like 'sunset-battery-falcon-origami'",
          "Reusing your favorite complex password across all your accounts to avoid forgetting it",
          "Changing your password every 14 days by changing the last digit"
        ]),
        correctIndex: 1,
        explanation: "Passphrases with 4+ random words offer high cryptographic entropy, resist brute force calculations by supercomputers, and are easy for humans to recall without resorting to predictable patterns.",
      },
      {
        courseId: "phishing-social-eng",
        question: "You receive an urgent email from 'CEO_Mark@company-support-desk.com' stating: 'I need you to buy 5 Amazon gift cards immediately for a VIP client. Do not call me, I am in a board meeting.' What should you do?",
        options: JSON.stringify([
          "Purchase the gift cards immediately because the CEO requested it",
          "Forward the email to all coworkers to see who has a company credit card",
          "Recognize this as a classic Business Email Compromise (BEC) scam; do not buy cards, and report the email to IT Security immediately",
          "Reply asking if $100 cards are sufficient"
        ]),
        correctIndex: 2,
        explanation: "This displays classic hallmarks of BEC: authority impersonation, artificial urgency, a lookalike domain, request for untraceable gift cards, and demanding secrecy or avoiding phone calls.",
      },
      {
        courseId: "cyber-fundamentals",
        question: "What is Multi-Factor Authentication (MFA) and why is it essential?",
        options: JSON.stringify([
          "Using two different web browsers to log into your work email",
          "Requiring two or more independent factors (something you know, have, or are) to verify identity, stopping 99%+ of automated account takeovers",
          "Having IT change your password twice every month",
          "Encrypting your desktop screen saver with a PIN"
        ]),
        correctIndex: 1,
        explanation: "MFA requires verification across multiple independent categories (Knowledge, Possession, Inherence). Even if an attacker steals your password, they cannot breach your account without your physical token or authenticator.",
      },
      {
        courseId: "malware-awareness",
        question: "What is Ransomware, and what is its primary mode of operation?",
        options: JSON.stringify([
          "Software that speeds up your internet connection by compressing images",
          "Malware that encrypts your files and storage drives, holding your data hostage until a cryptocurrency ransom is paid",
          "An antivirus program developed by cybersecurity agencies",
          "A harmless tracking cookie left by e-commerce websites"
        ]),
        correctIndex: 1,
        explanation: "Ransomware targets data availability by encrypting company files with strong cryptography and demanding extortion payments (usually in Bitcoin or Monero) to provide a decryption key.",
      },
      {
        courseId: "safe-internet-email",
        question: "When connecting your work laptop to public Wi-Fi at an airport or coffee shop, what essential safeguard should you enable?",
        options: JSON.stringify([
          "Disable your firewall so pages load faster",
          "Connect to the enterprise Virtual Private Network (VPN) and ensure HTTPS is active",
          "Turn off your laptop's screen lock",
          "Accept all security certificates without inspecting them"
        ]),
        correctIndex: 1,
        explanation: "Public Wi-Fi networks are unencrypted and subject to Man-in-the-Middle (MitM) packet sniffing and rogue 'Evil Twin' access points. An enterprise VPN encapsulates all your traffic inside an encrypted tunnel.",
      },
      {
        courseId: "data-privacy-protection",
        question: "Why should sensitive company documents containing customer Personal Identifiable Information (PII) always be encrypted at rest and in transit?",
        options: JSON.stringify([
          "To reduce file sizes on network storage servers",
          "To ensure that if physical drives are stolen or packets are intercepted, the data remains unreadable without cryptographic keys",
          "Because encryption makes PDFs load faster on mobile devices",
          "Only government agencies are legally allowed to use encryption"
        ]),
        correctIndex: 1,
        explanation: "Encryption renders plaintext into ciphertext. Even if an adversary intercepts traffic or steals a physical hard drive, they cannot view the confidential customer records without authorized cryptographic keys.",
      },
      {
        courseId: "device-security",
        question: "What does the 'Clean Desk & Clean Screen' policy require employees to do when leaving their workspace?",
        options: JSON.stringify([
          "Leave sticky notes with passwords under the keyboard",
          "Lock the computer screen (Win+L / Cmd+Ctrl+Q) and lock sensitive physical documents in secure drawers",
          "Leave the laptop open so colleagues can finish your tasks",
          "Turn off the building lights"
        ]),
        correctIndex: 1,
        explanation: "Locking workstations prevents unauthorized opportunistic access or shoulder-surfing by visitors, cleaning personnel, or unauthorized staff, while locking paper files prevents physical data theft.",
      },
      {
        courseId: "incident-reporting",
        question: "You accidentally clicked a suspicious link in an email and entered your login credentials on a strange page. What is the correct immediate action?",
        options: JSON.stringify([
          "Keep quiet and hope the security team does not notice",
          "Shut down your computer, go home, and wait until tomorrow",
          "Immediately report the incident to the IT Security/SOC team and change your password from a clean device",
          "Delete the email and clear your browser cache so no record remains"
        ]),
        correctIndex: 2,
        explanation: "Immediate reporting enables the SOC team to invalidate compromised session tokens, reset credentials, and isolate potential malware before attackers can move laterally into internal networks.",
      },
      {
        courseId: "social-media-security",
        question: "How do cybercriminals exploit Open Source Intelligence (OSINT) gathered from public social media profiles?",
        options: JSON.stringify([
          "They cannot use public information for cyber attacks",
          "They use company badges, project mentions, vacation dates, and org charts to craft believable spear-phishing and pretexting attacks",
          "They delete your LinkedIn profile permanently",
          "They automatically upgrade your software"
        ]),
        correctIndex: 1,
        explanation: "Adversaries analyze social media to learn your job role, company software stack, travel schedules, and executive relationships, enabling them to construct convincing spear-phishing pretexts.",
      },
    ]);

    // 5. Seed Incidents
    await db.insert(incidents).values([
      {
        referenceNo: "INC-2025-8492",
        employeeName: "Sarah Connor",
        employeeId: "EMP-1042",
        userId: "usr_emp_101",
        incidentType: "Phishing Email",
        urgency: "High",
        affectedSystem: "Corporate Outlook Inbox",
        description: "Received suspicious email purporting to be from Microsoft 365 Support demanding urgent MFA re-authentication at login-msoft-verify.online. Reported without clicking.",
        attachmentName: "phishing_sample_headers.eml",
        status: "Mitigated",
      },
      {
        referenceNo: "INC-2025-7821",
        employeeName: "Alex Chen",
        employeeId: "EMP-1088",
        userId: "usr_emp_102",
        incidentType: "Suspicious Login",
        urgency: "Critical",
        affectedSystem: "Finance ERP Gateway",
        description: "Detected unexpected login attempt from IP 185.220.101.5 (Tor Exit Node) attempting access to payroll module at 03:14 AM UTC. Access blocked by conditional policy.",
        attachmentName: "auth_audit_log.csv",
        status: "Resolved",
      },
      {
        referenceNo: "INC-2025-9104",
        employeeName: "Priya Sharma",
        employeeId: "EMP-1095",
        userId: "usr_emp_103",
        incidentType: "Lost/Stolen Device",
        urgency: "High",
        affectedSystem: "Company iPad Pro #442",
        description: "Tablet left in rideshare vehicle en route to client site. Device protected with BitLocker/MDM. Remote wipe command successfully triggered within 12 minutes.",
        attachmentName: "mdm_wipe_receipt.pdf",
        status: "Resolved",
      },
      {
        referenceNo: "INC-2025-9932",
        employeeName: "Sarah Connor",
        employeeId: "EMP-1042",
        userId: "usr_emp_101",
        incidentType: "Malware",
        urgency: "Medium",
        affectedSystem: "Workstation Dell XPS #1042",
        description: "CrowdStrike endpoint agent quarantined trojan dropper inside downloaded PDF invoice from unvetted third-party vendor. Endpoint isolated for hygiene check.",
        attachmentName: "crowdstrike_alert_export.json",
        status: "Investigating",
      },
    ]);

    // 6. Seed Achievements
    await db.insert(achievements).values([
      {
        userId: "usr_emp_101",
        badgeId: "beginner",
        title: "Cybersecurity Beginner",
        description: "Completed your first fundamental cybersecurity awareness course.",
        icon: "Shield",
        points: 100,
      },
      {
        userId: "usr_emp_101",
        badgeId: "phishing_defender",
        title: "Phishing Defender",
        description: "Identified all simulated phishing emails with a 100% accuracy score.",
        icon: "Fish",
        points: 250,
      },
      {
        userId: "usr_emp_101",
        badgeId: "password_protector",
        title: "Password Protector",
        description: "Mastered password entropy and configured enterprise multi-factor authentication.",
        icon: "Key",
        points: 200,
      },
      {
        userId: "usr_emp_101",
        badgeId: "security_champion",
        title: "Security Champion",
        description: "Maintained a high security score (>85) and an active 5+ day learning streak.",
        icon: "Award",
        points: 500,
      },
    ]);

    // 7. Seed Initial Course Progress
    await db.insert(userCourseProgress).values([
      {
        userId: "usr_emp_101",
        courseId: "cyber-fundamentals",
        progressPercent: 100,
        completed: true,
      },
      {
        userId: "usr_emp_101",
        courseId: "password-security",
        progressPercent: 100,
        completed: true,
      },
      {
        userId: "usr_emp_101",
        courseId: "phishing-social-eng",
        progressPercent: 65,
        completed: false,
      },
      {
        userId: "usr_emp_101",
        courseId: "malware-awareness",
        progressPercent: 25,
        completed: false,
      },
    ]);

    console.log("Database successfully seeded!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
