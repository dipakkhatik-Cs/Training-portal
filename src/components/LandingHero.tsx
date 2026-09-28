"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  ShieldAlert,
  Fish,
  KeyRound,
  Database,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Terminal,
  Activity,
  Award,
  ChevronRight,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { playClickSound } from "@/utils/sound";

export default function LandingHero() {
  const { setActiveTab, switchDemoUser } = useAuth();
  const [threatCount, setThreatCount] = useState(4821);
  const [activeBlip, setActiveBlip] = useState(0);

  // Dynamic threat defense simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
      setActiveBlip((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartTraining = () => {
    playClickSound();
    setActiveTab("courses");
  };

  const handleExploreCourses = () => {
    playClickSound();
    setActiveTab("courses");
  };

  const handlePhishingLab = () => {
    playClickSound();
    setActiveTab("phishing");
  };

  const stats = [
    { value: "10+", label: "Training Modules", desc: "NIST & ISO 27001 Aligned" },
    { value: "50+", label: "Security Tips", desc: "Actionable Defense Checklists" },
    { value: "100%", label: "Employee Awareness", desc: "Full Workforce Compliance" },
    { value: "98.4%", label: "Phish Catch Rate", desc: "Trained Detection Reflexes" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Security Awareness Training",
      desc: "Micro-learning modules teaching the CIA Triad, zero-trust hygiene, social engineering cues, and endpoint defenses.",
      color: "from-cyan-500 to-blue-600",
      tab: "courses",
    },
    {
      icon: Fish,
      title: "Phishing Awareness Lab",
      desc: "Interactive 'Spot the Phish' inbox drills with real-world typosquatted domains, BEC schemes, and header forensics.",
      color: "from-blue-500 to-indigo-600",
      tab: "phishing",
    },
    {
      icon: KeyRound,
      title: "Password & MFA Defense",
      desc: "Master high-entropy passphrases, avoid credential stuffing, and configure phishing-resistant FIDO2/TOTP authentication.",
      color: "from-amber-500 to-orange-600",
      tab: "courses",
    },
    {
      icon: Database,
      title: "Data Privacy & Governance",
      desc: "Safeguard customer PII, understand GDPR/HIPAA standards, and implement strict data classification tiers.",
      color: "from-purple-500 to-violet-600",
      tab: "tips",
    },
    {
      icon: AlertTriangle,
      title: "Incident Reporting Hotline",
      desc: "Real-time triage intake allowing employees to report suspected breaches and receive immediate containment advice.",
      color: "from-rose-500 to-red-600",
      tab: "incidents",
    },
    {
      icon: HelpCircle,
      title: "Cybersecurity Certification Quiz",
      desc: "Challenging 10-question evaluation with instant explanations, countdown timers, and downloadable certificates.",
      color: "from-emerald-500 to-teal-600",
      tab: "courses",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Assess Baseline Risk",
      desc: "Employees take an initial diagnostic quiz to discover blind spots in password hygiene and threat recognition.",
    },
    {
      step: "02",
      title: "Interactive Micro-Learning",
      desc: "Engage with bite-sized lessons, practical attack scenarios, and actionable security checklists.",
    },
    {
      step: "03",
      title: "Phishing Simulation Drills",
      desc: "Inspect simulated spear-phishing emails, analyze lookalike domains, and practice rapid threat escalation.",
    },
    {
      step: "04",
      title: "Certification & Badges",
      desc: "Earn XP points, unlock Security Champion badges, climb the leaderboard, and strengthen company defenses.",
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 overflow-hidden">
        {/* Glow background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/15 to-purple-600/20 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-cyan-950/40">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>Next-Gen Enterprise Human Defense System</span>
                <span className="hidden sm:inline text-cyan-500/60">•</span>
                <span className="hidden sm:inline text-cyan-400 font-mono text-[11px]">NIST SP 800-50</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                Build a Stronger{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Human Firewall
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Over 82% of data breaches involve the human element. The <strong className="text-white">CyberGuard</strong> employee training portal turns your workforce into an impenetrable frontline defense through interactive micro-lessons, realistic phishing simulations, and certified skills assessments.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleStartTraining}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Start Training</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={handlePhishingLab}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 hover:border-cyan-500/40 transition-all backdrop-blur-md shadow-md"
                >
                  <Fish className="w-4 h-4 text-cyan-400" />
                  <span>Spot the Phish Lab</span>
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setActiveTab("college-hub");
                  }}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 font-medium text-xs border border-purple-500/30 transition-all"
                >
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>College Project Hub</span>
                </button>
              </div>

              {/* Fast Demo Logins Bar */}
              <div className="pt-4 border-t border-slate-800/80 max-w-xl mx-auto lg:mx-0">
                <p className="text-xs text-slate-400 mb-2 flex items-center justify-center lg:justify-start gap-2 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  EVALUATOR QUICK ACCESS (ONE-CLICK):
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                  <button
                    onClick={() => switchDemoUser("employee")}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-cyan-950/40 border border-slate-700 hover:border-cyan-500/50 text-xs text-slate-300 flex items-center gap-1.5 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Employee: Sarah Connor</span>
                  </button>
                  <button
                    onClick={() => switchDemoUser("admin")}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/50 text-xs text-amber-300 flex items-center gap-1.5 transition"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin: Marcus Vance (CISO)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Interactive Visual: Threat Radar & Defense Shield */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-500/30 p-6 shadow-2xl backdrop-blur-xl">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80 animate-pulse"></div>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      CYBERGUARD THREAT RADAR
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/20">
                    SOC ACTIVE
                  </span>
                </div>

                {/* Radar Graphic */}
                <div className="relative w-64 h-64 mx-auto my-4 flex items-center justify-center">
                  {/* Concentric rings */}
                  <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-pulse"></div>
                  <div className="absolute inset-6 rounded-full border border-cyan-500/25"></div>
                  <div className="absolute inset-14 rounded-full border border-cyan-500/30"></div>
                  <div className="absolute inset-22 rounded-full border border-cyan-500/35"></div>

                  {/* Crosshairs */}
                  <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20"></div>
                  <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/20"></div>

                  {/* Sweeping Radar Needle */}
                  <div
                    className="absolute inset-0 rounded-full origin-center pointer-events-none"
                    style={{
                      background:
                        "conic-gradient(from 0deg, transparent 0deg, transparent 300deg, rgba(6, 182, 212, 0.4) 360deg)",
                      animation: "spin 4s linear infinite",
                    }}
                  ></div>

                  {/* Threat Blips */}
                  <div className={`absolute top-10 right-14 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] ${activeBlip === 0 ? "scale-125" : "opacity-60"}`} />
                  <div className={`absolute bottom-12 left-16 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] ${activeBlip === 1 ? "scale-125" : "opacity-60"}`} />
                  <div className={`absolute top-20 left-12 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] ${activeBlip === 2 ? "scale-125" : "opacity-60"}`} />
                  <div className={`absolute bottom-16 right-16 w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] ${activeBlip === 3 ? "scale-125" : "opacity-60"}`} />

                  {/* Center Shield Core */}
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                    <Shield className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>

                {/* Radar Telemetry Metrics */}
                <div className="space-y-2 mt-4 bg-slate-950/80 rounded-xl p-3 border border-slate-800 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      Attacks Intercepted:
                    </span>
                    <span className="text-white font-bold">{threatCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Phishing Vectors Blocked:</span>
                    <span className="text-emerald-400 font-bold">99.8%</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Human Firewall Readiness:</span>
                    <span className="text-cyan-300 font-bold">Optimal (Low Risk)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 p-5 sm:p-6 backdrop-blur-xl group hover:border-cyan-500/40 transition duration-300 shadow-xl"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition"></div>
                <p className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
                  {stat.value}
                </p>
                <h3 className="mt-2 text-sm sm:text-base font-bold text-white tracking-tight">
                  {stat.label}
                </h3>
                <p className="mt-1 text-xs text-slate-400">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
              CORE DEFENSE MODULES
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white tracking-tight">
              Comprehensive Security Architecture
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-400">
              Designed according to international cybersecurity frameworks (NIST SP 800-50, ISO 27001, CIS Controls) to train employees across all critical attack vectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    playClickSound();
                    setActiveTab(feat.tab);
                  }}
                  className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 p-6 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-cyan-950/30 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} p-0.5 mb-5 shadow-lg group-hover:scale-105 transition`}>
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition flex items-center justify-between">
                    <span>{feat.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition" />
                  </h3>

                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-slate-800 p-8 sm:p-12 backdrop-blur-xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                TRAINING WORKFLOW
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight">
                How CyberGuard Protects Your Enterprise
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                A seamless 4-stage progression turning raw curiosity into reflexive threat recognition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, idx) => (
                <div key={idx} className="relative p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <span className="font-mono text-3xl font-black text-cyan-500/30">
                    {s.step}
                  </span>
                  <h4 className="mt-2 text-base font-bold text-white">{s.title}</h4>
                  <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Bottom Banner inside How it works */}
            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">Ready to test your cybersecurity reflex?</h4>
                <p className="text-xs text-slate-400">Try our interactive Spot-The-Phish scenario simulator right now.</p>
              </div>
              <button
                onClick={handlePhishingLab}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition whitespace-nowrap"
              >
                Launch Phishing Lab
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* College Project Submission Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-purple-950/20 border border-purple-500/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-900/50 border border-purple-400/40 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>College Final Year Project Documentation & Codebase</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono font-bold">
                  ACADEMIC
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                Includes full Python Flask + SQLite standalone files (`app.py`, `models.py`, `init_db.py`, `requirements.txt`), ER diagrams, and a 15-question Viva Voce Cheat Sheet for defense presentation.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab("college-hub");
            }}
            className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
          >
            <span>Open Viva Hub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
}
