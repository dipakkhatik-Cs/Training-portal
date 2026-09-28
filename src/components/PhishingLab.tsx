"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Fish,
  ShieldCheck,
  ShieldAlert,
  Mail,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Info,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  Flame,
} from "lucide-react";
import { playClickSound, playSuccessSound, playAlertSound } from "@/utils/sound";

interface PhishingScenario {
  id: number;
  senderName: string;
  senderEmail: string;
  replyTo?: string;
  subject: string;
  timestamp: string;
  bodyContent: React.ReactNode;
  isPhishing: boolean;
  difficulty: "Easy" | "Medium" | "Hard";
  type: string;
  redFlags?: string[];
  safeIndicators?: string[];
  explanation: string;
}

export default function PhishingLab() {
  const { showToast } = useAuth();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userSelection, setUserSelection] = useState<boolean | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const scenarios: PhishingScenario[] = [
    {
      id: 1,
      senderName: "Microsoft 365 Security Team",
      senderEmail: "security-update@msoft-account-verify.online",
      replyTo: "no-reply@msoft-account-verify.online",
      subject: "ACTION REQUIRED: Your Office 365 Password Expires in 2 Hours",
      timestamp: "Today, 08:42 AM",
      difficulty: "Easy",
      type: "Credential Harvesting",
      isPhishing: true,
      bodyContent: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              M365
            </div>
            <div>
              <p className="font-bold text-slate-900">Microsoft Cloud Security Operations</p>
              <p className="text-[11px] text-slate-500">Notice ID: #MS-99214</p>
            </div>
          </div>
          <p>Dear Valued Employee,</p>
          <p>
            Your corporate Microsoft 365 account credentials will expire today at <strong>17:00 UTC</strong> due to company password policy. Failure to verify immediately will cause system lock-out and termination of mailbox sync.
          </p>
          <p>To retain your existing password and prevent business disruption, verify your identity immediately:</p>
          <div className="py-2">
            <span
              onMouseEnter={() => setHoveredLink("http://msoft-account-verify.online/auth/login.php?user=target")}
              onMouseLeave={() => setHoveredLink(null)}
              className="inline-block px-5 py-2.5 rounded bg-blue-600 text-white font-bold text-xs cursor-pointer hover:bg-blue-700 shadow-sm"
            >
              Keep My Same Password →
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            This is an automated notification. Do not reply to this email. Microsoft Corporation, One Microsoft Way, Redmond, WA.
          </p>
        </div>
      ),
      redFlags: [
        "Sender Domain Spoofing: Notice the domain is '@msoft-account-verify.online', NOT official '@microsoft.com'.",
        "Artificial Urgency: 'Expires in 2 Hours' triggers panic so you click before analyzing.",
        "Generic Greeting: 'Dear Valued Employee' instead of your corporate name.",
        "Mismatched Destination URL: The button links to an insecure HTTP site on a rogue registrar.",
        "Illogical Policy: Legitimate IT systems never offer a link to 'keep your existing password' without rotating.",
      ],
      explanation:
        "This is an aggressive credential harvesting attack. Cybercriminals build clone Microsoft login pages to capture your enterprise username and password in plaintext.",
    },
    {
      id: 2,
      senderName: "CyberGuard People Operations",
      senderEmail: "hr-notifications@cyberguard.internal",
      subject: "Company All-Hands Meeting & Q3 Security Town Hall (Calendar Invite)",
      timestamp: "Today, 10:15 AM",
      difficulty: "Medium",
      type: "Internal Corporate Communication",
      isPhishing: false,
      bodyContent: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <div className="w-8 h-8 rounded bg-cyan-600 flex items-center justify-center text-white font-bold text-xs">
              HR
            </div>
            <div>
              <p className="font-bold text-slate-900">CyberGuard HR Department</p>
              <p className="text-[11px] text-slate-500">Internal Communication</p>
            </div>
          </div>
          <p>Hi Team,</p>
          <p>
            Please join our quarterly All-Hands Town Hall this Thursday at 2:00 PM EST. The leadership team will present our product roadmap, employee recognition awards, and the SOC quarterly threat briefing.
          </p>
          <p>You can view the full agenda on our internal intranet wiki:</p>
          <div className="py-1">
            <span
              onMouseEnter={() => setHoveredLink("https://wiki.cyberguard.internal/events/2025-q3-all-hands")}
              onMouseLeave={() => setHoveredLink(null)}
              className="text-blue-600 underline font-semibold text-xs cursor-pointer hover:text-blue-800"
            >
              https://wiki.cyberguard.internal/events/2025-q3-all-hands
            </span>
          </div>
          <p className="text-xs text-slate-600">See you there,<br />CyberGuard HR Leadership Team</p>
        </div>
      ),
      safeIndicators: [
        "Internal Enterprise Domain: Originates from verified '@cyberguard.internal' corporate mail server.",
        "DKIM & SPF Passed: Authenticated by internal exchange server.",
        "Intranet URL: Points exclusively to internal corporate wiki 'wiki.cyberguard.internal' over HTTPS.",
        "No Coercion or Financial Request: Standard company announcement without false urgency.",
      ],
      explanation:
        "This email is completely SAFE and legitimate. It originates from internal HR, uses genuine internal URLs, contains no suspicious attachments, and exhibits verified authentication headers.",
    },
    {
      id: 3,
      senderName: "David Sterling (Chief Executive Officer)",
      senderEmail: "david.sterling.ceo@exec-private-mail.org",
      replyTo: "ceo-office-confidential@exec-private-mail.org",
      subject: "URGENT & CONFIDENTIAL: Client Gift Cards for Partner Closing",
      timestamp: "Yesterday, 04:30 PM",
      difficulty: "Medium",
      type: "Business Email Compromise (BEC)",
      isPhishing: true,
      bodyContent: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-800">
          <p>Are you at your desk right now?</p>
          <p>
            I need your urgent assistance with a confidential client matter. I am currently in a closed-door board meeting and cannot take voice calls.
          </p>
          <p>
            We need to provide 5x $100 Apple or Amazon e-gift cards for a key enterprise client partner before 5:00 PM today. Please purchase these on your company card (or personal card, expense will be reimbursed immediately) and email the digital redemption codes directly to this email address.
          </p>
          <p>
            Do not mention this to other colleagues yet as the partner acquisition is under strict NDA.
          </p>
          <p className="font-semibold text-slate-900 mt-2">
            David Sterling<br />
            Chief Executive Officer
          </p>
        </div>
      ),
      redFlags: [
        "Executive Impersonation (Whaling): Adversary pretends to be the CEO.",
        "External Free/Spoofed Domain: From '@exec-private-mail.org', NOT the real company domain.",
        "Channel Avoidance: 'Do not call me, I am in a board meeting' prevents out-of-band verification.",
        "Untraceable Value: Gift cards are the #1 preferred currency of cyber extortionists because transactions cannot be reversed.",
        "Demanding Secrecy: 'Under strict NDA, do not tell coworkers' stops you from consulting finance.",
      ],
      explanation:
        "This is a classic Business Email Compromise (BEC) attack. Attackers exploit fear of displeasing an executive and demand untraceable gift cards under the pretext of an emergency.",
    },
    {
      id: 4,
      senderName: "Payroll & Compensation Department",
      senderEmail: "payroll-portal@secure-adp-paycheck-verification.com",
      subject: "Action Required: Failed Direct Deposit - Re-confirm Bank Routing",
      timestamp: "2 days ago",
      difficulty: "Hard",
      type: "Financial Fraud / Credential Harvesting",
      isPhishing: true,
      bodyContent: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-800">
          <div className="border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-900 text-sm">Automated Clearing House (ACH) Payroll Notification</span>
          </div>
          <p>Dear Employee,</p>
          <p>
            Your upcoming direct deposit of <strong>$3,450.80</strong> scheduled for the upcoming pay cycle could not be processed due to a routing validation mismatch between the clearinghouse and your depository institution.
          </p>
          <p>
            In order to avoid a delay in salary disbursement, you must authenticate to the secure payroll self-service portal and re-enter your account routing numbers within 24 hours.
          </p>
          <div className="py-2">
            <span
              onMouseEnter={() => setHoveredLink("https://secure-adp-paycheck-verification.com/login?redirect=banking")}
              onMouseLeave={() => setHoveredLink(null)}
              className="inline-block px-5 py-2.5 rounded bg-emerald-700 text-white font-bold text-xs cursor-pointer hover:bg-emerald-800"
            >
              Update Banking Information →
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Automated Payroll Security Gateway. Reference Batch ID: #ACH-2025-0814.
          </p>
        </div>
      ),
      redFlags: [
        "Third-Party Lookalike Domain: '@secure-adp-paycheck-verification.com' is an unauthorized lookalike domain registered recently.",
        "High-Stakes Emotional Hook: Threat of missing a salary paycheck induces panic.",
        "Direct Request for Financial Credentials: Bank routing and account numbers.",
        "Suspicious Login Portal: Genuine enterprise HR systems do not send external links for banking modifications.",
      ],
      explanation:
        "Payroll phishing attacks trick employees into entering their bank routing details on a fraudulent replica portal, redirecting the victim's paycheck straight into an attacker's offshore bank account.",
    },
    {
      id: 5,
      senderName: "IT Infrastructure SOC",
      senderEmail: "soc-announcements@cyberguard.internal",
      subject: "Scheduled Network Firewall Maintenance: Saturday 02:00 - 04:00 AM UTC",
      timestamp: "3 days ago",
      difficulty: "Easy",
      type: "IT Infrastructure Announcement",
      isPhishing: false,
      bodyContent: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-800">
          <p>Good morning team,</p>
          <p>
            The Security Operations and Infrastructure team will be performing scheduled firmware upgrades on our primary datacenter edge firewalls this Saturday from 02:00 to 04:00 AM UTC.
          </p>
          <p>
            <strong>Impact:</strong> Brief 5-minute VPN reconnection disconnects may occur during failover testing. Internal systems and email access will remain fully operational.
          </p>
          <p>
            No employee action is required. If you experience persistent connectivity issues after 05:00 AM UTC, please contact the internal IT Helpdesk at extension 4410.
          </p>
          <p className="text-xs text-slate-600">
            Thank you for your cooperation,<br />
            CyberGuard SOC & Network Engineering
          </p>
        </div>
      ),
      safeIndicators: [
        "Verified Sender: Authentic internal domain '@cyberguard.internal'.",
        "Zero Coercion: Explicitly states 'No employee action is required'.",
        "No Suspicious Links or Attachments: Standard informative bulletin.",
        "Internal Extension: Lists internal phone contact (ext. 4410).",
      ],
      explanation:
        "This is a 100% SAFE operational bulletin. Notice there are no links, no login demands, and no pressure on the user.",
    },
  ];

  const current = scenarios[currentScenarioIndex];

  const handleDecision = (chosenPhishing: boolean) => {
    playClickSound();
    setUserSelection(chosenPhishing);
    setRevealed(true);

    const isCorrect = chosenPhishing === current.isPhishing;
    if (isCorrect) {
      playSuccessSound();
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      showToast("Correct identification! Threat vector recognized.", "success");
    } else {
      playAlertSound();
      setStreak(0);
      showToast("Incorrect assessment. Read the forensic breakdown below.", "error");
    }
  };

  const handleNext = () => {
    playClickSound();
    setRevealed(false);
    setUserSelection(null);
    setHoveredLink(null);
    setCurrentScenarioIndex((prev) => (prev + 1) % scenarios.length);
  };

  const handleResetLab = () => {
    playClickSound();
    setCurrentScenarioIndex(0);
    setUserSelection(null);
    setRevealed(false);
    setScore(0);
    setStreak(0);
    setHoveredLink(null);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              TACTICAL SIMULATION LAB
            </span>
            <span className="text-xs text-slate-400">
              SCENARIO {currentScenarioIndex + 1} OF {scenarios.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Spot the Phishing Email Simulation
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect sender headers, URLs, and language cues. Decide whether this message is Safe or Phishing.
          </p>
        </div>

        {/* Score & Streak counter */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 font-mono text-xs">
          <div>
            <p className="text-[10px] text-slate-500 uppercase">Correct Catches</p>
            <p className="text-base font-bold text-cyan-400">
              {score} / {scenarios.length}
            </p>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase">Current Streak</p>
            <p className="text-base font-bold text-amber-400 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400" />
              {streak}
            </p>
          </div>
        </div>
      </div>

      {/* Email Client Simulator Window */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Email Client Window Top Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span className="ml-2 text-xs font-mono text-slate-400 font-semibold">
              CyberGuard Secure Mail Client v4.8
            </span>
          </div>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              current.difficulty === "Easy"
                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                : current.difficulty === "Medium"
                ? "bg-blue-950 text-blue-400 border border-blue-500/30"
                : "bg-purple-950 text-purple-400 border border-purple-500/30"
            }`}
          >
            DIFFICULTY: {current.difficulty.toUpperCase()}
          </span>
        </div>

        {/* Email Header Details (Forensic Inspector) */}
        <div className="bg-slate-900/40 border-b border-slate-800/80 p-5 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="font-mono text-slate-400 font-bold uppercase w-20 flex-shrink-0">
              FROM:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-white font-bold">{current.senderName}</span>
              <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                &lt;{current.senderEmail}&gt;
              </span>
            </div>
          </div>

          {current.replyTo && (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <span className="font-mono text-slate-500 font-bold uppercase w-20 flex-shrink-0">
                REPLY-TO:
              </span>
              <span className="font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                &lt;{current.replyTo}&gt;
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="font-mono text-slate-400 font-bold uppercase w-20 flex-shrink-0">
              SUBJECT:
            </span>
            <span className="text-white font-semibold">{current.subject}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <span className="font-mono text-slate-500 font-bold uppercase w-20 flex-shrink-0">
              TIMESTAMP:
            </span>
            <span className="text-slate-400 font-mono">{current.timestamp}</span>
          </div>
        </div>

        {/* Email Body Area (Rendered in Realistic White/Clean Container) */}
        <div className="p-6 sm:p-8 bg-slate-100 min-h-[220px]">
          {current.bodyContent}
        </div>

        {/* Browser Status Bar / Link Hover Preview Simulation */}
        <div className="bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2 text-slate-400 truncate">
            <Eye className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>Link Inspector:</span>
            {hoveredLink ? (
              <span className="text-rose-400 font-bold truncate underline">
                {hoveredLink}
              </span>
            ) : (
              <span className="text-slate-600 italic">
                Hover over any link or button inside the email to inspect true destination URL
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Decision Interface */}
      {!revealed ? (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 backdrop-blur-xl text-center space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-white">
            Is this incoming email SAFE or PHISHING?
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Carefully analyze the sender domain, greeting style, urgency, and destination URL before deciding.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleDecision(false)}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>It is SAFE</span>
            </button>

            <button
              onClick={() => handleDecision(true)}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-sm shadow-lg shadow-rose-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>It is PHISHING!</span>
            </button>
          </div>
        </div>
      ) : (
        /* Forensic Analysis Result Breakdown */
        <div className="rounded-3xl bg-slate-900/95 border border-slate-800 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  userSelection === current.isPhishing
                    ? "bg-emerald-950 border border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    : "bg-rose-950 border border-rose-400 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                }`}
              >
                {userSelection === current.isPhishing ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <XCircle className="w-7 h-7" />
                )}
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  ASSESSMENT VERDICT
                </span>
                <h3 className="text-xl font-black text-white">
                  {userSelection === current.isPhishing
                    ? "Accurate Identification!"
                    : "Threat Missed / False Alarm"}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
                  current.isPhishing
                    ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                    : "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                }`}
              >
                VERDICT: {current.isPhishing ? "CONFIRMED PHISHING THREAT" : "VERIFIED SAFE EMAIL"}
              </span>
            </div>
          </div>

          {/* Forensic breakdown */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-cyan-400">Threat Intelligence Analysis:</strong>{" "}
              {current.explanation}
            </div>

            {current.redFlags && current.redFlags.length > 0 && (
              <div className="rounded-2xl bg-rose-950/20 border border-rose-500/30 p-5 space-y-3">
                <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Key Red Flags Identified in this Email:
                </h4>
                <ul className="text-xs text-slate-300 space-y-2">
                  {current.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {current.safeIndicators && current.safeIndicators.length > 0 && (
              <div className="rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-5 space-y-3">
                <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Legitimate Verification Indicators:
                </h4>
                <ul className="text-xs text-slate-300 space-y-2">
                  {current.safeIndicators.map((ind, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleResetLab}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Simulation</span>
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition"
            >
              <span>Next Scenario Drill</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
