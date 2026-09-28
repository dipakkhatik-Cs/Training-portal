"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import LandingHero from "@/components/LandingHero";
import EmployeeDashboard from "@/components/EmployeeDashboard";
import CoursesCatalog from "@/components/CoursesCatalog";
import QuizSection from "@/components/QuizSection";
import PhishingLab from "@/components/PhishingLab";
import SecurityTipsSection from "@/components/SecurityTipsSection";
import IncidentReportingSection from "@/components/IncidentReportingSection";
import AchievementsSection from "@/components/AchievementsSection";
import AdminDashboard from "@/components/AdminDashboard";
import CollegeVivaHub from "@/components/CollegeVivaHub";
import LoginPage from "@/components/LoginPage";
import {
  Shield,
  ShieldCheck,
  ChevronRight,
  Home,
  HelpCircle,
  Award,
  BookOpen,
  Fish,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { playClickSound } from "@/utils/sound";

export default function HomePage() {
  const { activeTab, setActiveTab, currentUser } = useAuth();

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "dashboard":
        return "Employee Security Dashboard";
      case "courses":
        return "Training Courses Catalog";
      case "quiz":
        return "Cybersecurity Certification Quiz";
      case "phishing":
        return "Spot-The-Phish Simulation Lab";
      case "tips":
        return "Actionable Security Tips";
      case "incidents":
        return "Incident Reporting & Triage Hotline";
      case "achievements":
        return "Security Defense Leaderboard";
      case "admin":
        return "CISO & SOC Admin Control Console";
      case "college-hub":
        return "College Viva & Project Documentation Hub";
      case "login":
        return "Enterprise Single Sign-On Authentication";
      default:
        return "Home";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-x-hidden">
      {/* Dynamic ambient cyber background pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/5 rounded-full blur-[160px]" />
      </div>

      {/* Persistent Navigation Bar */}
      <Navbar />

      {/* Breadcrumb Bar (Visible when not on Landing page) */}
      {activeTab !== "landing" && (
        <div className="relative z-10 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("landing");
                }}
                className="hover:text-cyan-400 flex items-center gap-1 transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white font-semibold truncate">
                {getTabTitle(activeTab)}
              </span>
            </div>

            {/* Quick Switch between Courses and Quiz if on either */}
            {activeTab === "courses" && (
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("quiz");
                }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Jump to Certification Quiz →</span>
              </button>
            )}

            {activeTab === "quiz" && (
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("courses");
                }}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>← Back to Courses Catalog</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === "landing" && <LandingHero />}
        {activeTab === "dashboard" && <EmployeeDashboard />}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("quiz");
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <Award className="w-4 h-4" />
                <span>Take General Certification Quiz</span>
              </button>
            </div>
            <CoursesCatalog />
          </div>
        )}
        {activeTab === "quiz" && <QuizSection />}
        {activeTab === "phishing" && <PhishingLab />}
        {activeTab === "tips" && <SecurityTipsSection />}
        {activeTab === "incidents" && <IncidentReportingSection />}
        {activeTab === "achievements" && <AchievementsSection />}
        {activeTab === "admin" && <AdminDashboard />}
        {activeTab === "college-hub" && <CollegeVivaHub />}
        {activeTab === "login" && <LoginPage />}
      </main>

      {/* Enterprise CyberGuard Footer */}
      <footer className="relative z-10 mt-auto border-t border-slate-800 bg-slate-950/90 backdrop-blur-xl pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            {/* Col 1: Brand & Abstract */}
            <div className="lg:col-span-2 space-y-4">
              <div
                onClick={() => {
                  playClickSound();
                  setActiveTab("landing");
                }}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950">
                  <Shield className="w-5 h-5 fill-current" />
                </div>
                <span className="text-lg font-black text-white">
                  Cyber<span className="text-cyan-400">Guard</span>
                </span>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded font-mono">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Employee Cybersecurity Awareness & Defense Training Portal. Built to fortify organizations against social engineering, credential harvesting, malware, and data compromise.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>HUMAN FIREWALL STATUS: OPTIMAL</span>
              </div>
            </div>

            {/* Col 2: Training & Labs */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-white uppercase font-mono tracking-wider">
                Training & Labs
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button
                    onClick={() => {
                      playClickSound();
                      setActiveTab("courses");
                    }}
                    className="hover:text-cyan-400 transition"
                  >
                    10 Training Modules
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      playClickSound();
                      setActiveTab("phishing");
                    }}
                    className="hover:text-cyan-400 transition"
                  >
                    Spot The Phish Lab
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      playClickSound();
                      setActiveTab("quiz");
                    }}
                    className="hover:text-cyan-400 transition"
                  >
                    Certification Quiz
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      playClickSound();
                      setActiveTab("tips");
                    }}
                    className="hover:text-cyan-400 transition"
                  >
                    Actionable Security Tips
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Incident & SOC */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-white uppercase font-mono tracking-wider">
                Response & Triage
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <button
                    onClick={() => {
                      playClickSound();
                      setActiveTab("incidents");
                    }}
                    className="hover:text-rose-400 transition"
                  >
                    Report Incident Hotline
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      playClickSound();
                      setActiveTab("admin");
                    }}
                    className="hover:text-amber-400 transition"
                  >
                    SOC Admin Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      playClickSound();
                      setActiveTab("achievements");
                    }}
                    className="hover:text-purple-400 transition"
                  >
                    Leaderboard & Badges
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      playClickSound();
                      setActiveTab("dashboard");
                    }}
                    className="hover:text-cyan-400 transition"
                  >
                    My Employee Dashboard
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: College Project & Viva */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-purple-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>College Project Hub</span>
              </h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Flask backend, SQLite setup, viva questions, and architecture diagrams.
              </p>
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("college-hub");
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-purple-300 font-bold text-[11px] hover:bg-purple-900/60 transition"
              >
                <span>Open Project Viva Hub</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Bottom Copyright & Standards */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
            <p>© 2025 CyberGuard Security Awareness Systems. College Final Year Project.</p>
            <div className="flex items-center gap-4 text-[11px]">
              <span>NIST SP 800-50 Aligned</span>
              <span>•</span>
              <span>ISO 27001 Human Defense</span>
              <span>•</span>
              <span>SOC 2 Type II Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
